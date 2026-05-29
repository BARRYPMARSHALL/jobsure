import db from '../database';
import { generateId } from '../utils/helpers';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type SensingCategory = 'competitor' | 'regulation' | 'market' | 'weather' | 'social' | 'customer';
export type SensingSeverity = 'info' | 'warning' | 'critical';

export interface SensingEvent {
  id: string;
  organization_id: string;
  category: SensingCategory;
  source: string | null;
  title: string;
  description: string | null;
  severity: SensingSeverity;
  url: string | null;
  detected_at: string;
  is_actionable: number;
  action_taken: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface SensingReport {
  organization_id: string;
  generated_at: string;
  period_days: number;
  total_events: number;
  events_by_category: Record<SensingCategory, {
    count: number;
    trend: 'up' | 'down' | 'stable';
    events: SensingEvent[];
  }>;
  summary: string;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const VALID_CATEGORIES: SensingCategory[] = ['competitor', 'regulation', 'market', 'weather', 'social', 'customer'];
const VALID_SEVERITIES: SensingSeverity[] = ['info', 'warning', 'critical'];

function logActivity(
  organizationId: string,
  actionType: string,
  actionSummary: string,
  details?: string,
): void {
  db.prepare(
    `INSERT INTO agent_activity_log (id, organization_id, agent_name, action_type, action_summary, details, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
  ).run(
    generateId(),
    organizationId,
    'Sensing Agent',
    actionType,
    actionSummary,
    details || null,
    'completed',
  );
}

// ──────────────────────────────────────────────
// 1. logSensingEvent
// ──────────────────────────────────────────────

/**
 * Log a new sensing event into the system.
 * @returns The created SensingEvent.
 */
export function logSensingEvent(
  orgId: string,
  category: SensingCategory,
  title: string,
  description: string,
  severity?: SensingSeverity,
  url?: string,
): SensingEvent {
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid sensing category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  const id = generateId();
  const resolvedSeverity = severity && VALID_SEVERITIES.includes(severity) ? severity : 'info';
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO sensing_events (id, organization_id, category, source, title, description, severity, url, detected_at, is_actionable, action_taken, resolved_at, created_at)
     VALUES (?, ?, ?, 'agent', ?, ?, ?, ?, ?, 1, NULL, NULL, ?)`,
  ).run(id, orgId, category, title, description, resolvedSeverity, url || null, now, now);

  logActivity(
    orgId,
    'sensing_event_logged',
    `Sensing event logged — [${resolvedSeverity}] ${category}: ${title}`,
    JSON.stringify({ eventId: id, category, severity: resolvedSeverity, title, description, url }),
  );

  const event = db.prepare('SELECT * FROM sensing_events WHERE id = ?').get(id) as SensingEvent;
  return event;
}

// ──────────────────────────────────────────────
// 2. getSensingEvents
// ──────────────────────────────────────────────

/**
 * Query sensing events with optional filters.
 * @param orgId Organization ID (required)
 * @param category Filter by category (optional)
 * @param actionable Filter by is_actionable (optional, 0/1)
 * @param days Only events within this many days (optional)
 */
export function getSensingEvents(
  orgId: string,
  category?: SensingCategory,
  actionable?: number,
  days?: number,
): SensingEvent[] {
  let sql = 'SELECT * FROM sensing_events WHERE organization_id = ?';
  const params: (string | number)[] = [orgId];

  if (category && VALID_CATEGORIES.includes(category)) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (actionable === 0 || actionable === 1) {
    sql += ' AND is_actionable = ?';
    params.push(actionable);
  }

  if (days !== undefined && days > 0) {
    sql += ` AND detected_at >= datetime('now', ? || ' days')`;
    params.push(`-${days}`);
  }

  sql += ' ORDER BY detected_at DESC';

  const events = db.prepare(sql).all(...params) as SensingEvent[];

  logActivity(
    orgId,
    'sensing_events_queried',
    `Queried sensing events — found ${events.length} result(s)${category ? ` for category "${category}"` : ''}${days ? ` within ${days} day(s)` : ''}`,
    JSON.stringify({ category, actionable, days, resultCount: events.length }),
  );

  return events;
}

// ──────────────────────────────────────────────
// 3. getUrgentEvents
// ──────────────────────────────────────────────

/**
 * Return critical and warning sensing events that are actionable but not yet resolved.
 */
export function getUrgentEvents(orgId: string): SensingEvent[] {
  const events = db.prepare(
    `SELECT * FROM sensing_events
     WHERE organization_id = ?
       AND severity IN ('critical', 'warning')
       AND is_actionable = 1
       AND resolved_at IS NULL
     ORDER BY
       CASE severity WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END,
       detected_at ASC`,
  ).all(orgId) as SensingEvent[];

  logActivity(
    orgId,
    'urgent_events_retrieved',
    `Retrieved ${events.length} urgent unresolved sensing event(s)`,
    events.length > 0
      ? JSON.stringify({ count: events.length, criticalCount: events.filter(e => e.severity === 'critical').length })
      : undefined,
  );

  return events;
}

// ──────────────────────────────────────────────
// 4. generateSensingReport
// ──────────────────────────────────────────────

/**
 * Generate a 90-day sensing report grouped by category with trend analysis.
 * Trend compares the last 30 days to the 30 days before that within the 90-day window.
 */
export function generateSensingReport(orgId: string): SensingReport {
  const days = 90;
  const now = new Date().toISOString();

  // Pull all events from the last 90 days
  const allEvents = db.prepare(
    `SELECT * FROM sensing_events
     WHERE organization_id = ?
       AND detected_at >= datetime('now', '-90 days')
     ORDER BY detected_at DESC`,
  ).all(orgId) as SensingEvent[];

  // Group by category
  const eventsByCategory = {} as SensingReport['events_by_category'];

  for (const cat of VALID_CATEGORIES) {
    const catEvents = allEvents.filter(e => e.category === cat);
    const count = catEvents.length;

    // Trend analysis: compare last 30 days to the 30 days before that
    const recent30 = catEvents.filter(
      e => e.detected_at >= datetimeOffset(-30),
    ).length;
    const prior30 = catEvents.filter(
      e => e.detected_at >= datetimeOffset(-60) && e.detected_at < datetimeOffset(-30),
    ).length;

    let trend: 'up' | 'down' | 'stable';
    if (recent30 > prior30) {
      trend = 'up';
    } else if (recent30 < prior30) {
      trend = 'down';
    } else {
      trend = 'stable';
    }

    eventsByCategory[cat] = {
      count,
      trend,
      events: catEvents,
    };
  }

  const totalEvents = allEvents.length;

  // Build a human-readable summary
  const urgent = allEvents.filter(
    e => (e.severity === 'critical' || e.severity === 'warning') && e.is_actionable === 1 && !e.resolved_at,
  ).length;
  const criticalCount = allEvents.filter(e => e.severity === 'critical').length;
  const actionableCount = allEvents.filter(e => e.is_actionable === 1).length;

  const summary = [
    `90-day sensing report: ${totalEvents} total events detected.`,
    `${criticalCount} critical, ${actionableCount} actionable, ${urgent} urgent unresolved.`,
    ...VALID_CATEGORIES.map(cat => {
      const c = eventsByCategory[cat];
      return `  ${cat}: ${c.count} events (${c.trend})`;
    }),
  ].join('\n');

  const report: SensingReport = {
    organization_id: orgId,
    generated_at: now,
    period_days: days,
    total_events: totalEvents,
    events_by_category: eventsByCategory,
    summary,
  };

  logActivity(
    orgId,
    'sensing_report_generated',
    `Generated 90-day sensing report — ${totalEvents} events across ${VALID_CATEGORIES.length} categories`,
    JSON.stringify({
      totalEvents,
      criticalCount,
      actionableCount,
      urgentUnresolved: urgent,
      categories: VALID_CATEGORIES.reduce((acc, cat) => {
        acc[cat] = { count: eventsByCategory[cat].count, trend: eventsByCategory[cat].trend };
        return acc;
      }, {} as Record<string, { count: number; trend: string }>),
    }),
  );

  return report;
}

/**
 * Helper to compute an ISO datetime offset from now.
 */
function datetimeOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

// ──────────────────────────────────────────────
// 5. resolveEvent
// ──────────────────────────────────────────────

/**
 * Mark a sensing event as resolved.
 * @returns The updated SensingEvent.
 */
export function resolveEvent(
  eventId: string,
  actionTaken: string,
): SensingEvent {
  const event = db.prepare('SELECT * FROM sensing_events WHERE id = ?').get(eventId) as SensingEvent | undefined;

  if (!event) {
    throw new Error(`Sensing event ${eventId} not found`);
  }

  const now = new Date().toISOString();

  db.prepare(
    `UPDATE sensing_events SET action_taken = ?, resolved_at = ? WHERE id = ?`,
  ).run(actionTaken, now, eventId);

  logActivity(
    event.organization_id,
    'sensing_event_resolved',
    `Resolved sensing event ${eventId} — [${event.severity}] ${event.category}: ${event.title}`,
    JSON.stringify({ eventId, category: event.category, severity: event.severity, title: event.title, actionTaken }),
  );

  const updated = db.prepare('SELECT * FROM sensing_events WHERE id = ?').get(eventId) as SensingEvent;
  return updated;
}
