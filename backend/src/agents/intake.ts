import db from '../database';
import { generateId } from '../utils/helpers';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface CaptureLeadParams {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_category: string;
  description: string;
  property_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  urgency?: string;
  budget_range?: string;
  source?: string;
}

export interface Lead {
  id: string;
  organization_id: string | null;
  partner_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  service_category: string;
  description: string;
  property_address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  urgency: string;
  budget_range: string | null;
  source: string;
  status: string;
  qualified: number;
  qualification_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QualificationResult {
  score: number;
  reason: string;
}

export interface Booking {
  id: string;
  lead_id: string;
  partner_id: string;
  organization_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_category: string;
  description: string | null;
  property_address: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number;
  status: string;
  estimated_cost_cents: number | null;
  final_cost_cents: number | null;
  partner_notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  organization_id: string;
  company_name: string;
  trade_type: string;
  service_areas: string;
  calendar_json: string | null;
  is_active: number;
  per_booking_fee_cents: number;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function logActivity(
  actionType: string,
  summary: string,
  details: Record<string, unknown> | null = null,
  orgId: string | null = null,
  status: string = 'completed',
): void {
  db.prepare(
    `INSERT INTO agent_activity_log (id, organization_id, agent_name, action_type, action_summary, details, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    generateId(),
    orgId,
    'intake-agent',
    actionType,
    summary,
    details ? JSON.stringify(details) : null,
    status,
  );
}

// ──────────────────────────────────────────────
// 1. captureLead
// ──────────────────────────────────────────────

export function captureLead(params: CaptureLeadParams): Lead {
  const id = generateId();
  const now = new Date().toISOString();

  const lead = {
    id,
    organization_id: null,
    partner_id: null,
    customer_name: params.customer_name,
    customer_email: params.customer_email ?? null,
    customer_phone: params.customer_phone,
    service_category: params.service_category,
    description: params.description,
    property_address: params.property_address ?? null,
    city: params.city ?? null,
    state: params.state ?? null,
    zip: params.zip ?? null,
    urgency: params.urgency ?? 'normal',
    budget_range: params.budget_range ?? null,
    source: params.source ?? 'web',
    status: 'new',
    qualified: 0,
    qualification_notes: null,
    created_at: now,
    updated_at: now,
  };

  db.prepare(
    `INSERT INTO leads (
      id, organization_id, partner_id,
      customer_name, customer_email, customer_phone,
      service_category, description,
      property_address, city, state, zip,
      urgency, budget_range, source, status,
      qualified, qualification_notes,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?
    )`,
  ).run(
    lead.id, lead.organization_id, lead.partner_id,
    lead.customer_name, lead.customer_email, lead.customer_phone,
    lead.service_category, lead.description,
    lead.property_address, lead.city, lead.state, lead.zip,
    lead.urgency, lead.budget_range, lead.source, lead.status,
    lead.qualified, lead.qualification_notes,
    lead.created_at, lead.updated_at,
  );

  logActivity(
    'lead_captured',
    `Captured lead for ${params.customer_name} — ${params.service_category}`,
    { lead_id: id, source: params.source ?? 'web', service_category: params.service_category },
  );

  return lead;
}

// ──────────────────────────────────────────────
// 2. qualifyLead
// ──────────────────────────────────────────────

export function qualifyLead(leadId: string): QualificationResult {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead | undefined;

  if (!lead) {
    logActivity('qualify_failed', `Lead ${leadId} not found`, { lead_id: leadId }, null, 'failed');
    return { score: 0, reason: 'Lead not found' };
  }

  let score = 0;
  const missing: string[] = [];

  // Phone: 30 points (most important for contact)
  if (lead.customer_phone && lead.customer_phone.trim().length >= 7) {
    score += 30;
  } else {
    missing.push('valid phone number');
  }

  // Email: 15 points
  if (lead.customer_email && lead.customer_email.includes('@')) {
    score += 15;
  } else {
    missing.push('email address');
  }

  // Description: 25 points
  if (lead.description && lead.description.trim().length >= 10) {
    score += 25;
  } else {
    missing.push('detailed description');
  }

  // Property Address: 15 points
  if (lead.property_address && lead.property_address.trim().length > 0) {
    score += 15;
  } else {
    missing.push('property address');
  }

  // City: 5 points
  if (lead.city && lead.city.trim().length > 0) {
    score += 5;
  } else {
    missing.push('city');
  }

  // State: 5 points
  if (lead.state && lead.state.trim().length > 0) {
    score += 5;
  } else {
    missing.push('state');
  }

  // Zip: 5 points (bonus for precise location)
  if (lead.zip && lead.zip.trim().length > 0) {
    score += 5;
  }

  // Urgency / budget: optional bonuses
  if (lead.urgency && lead.urgency !== 'normal') {
    score += 5;
  }
  if (lead.budget_range) {
    score += 5;
  }

  // Clamp to 0-100
  score = Math.min(100, Math.max(0, score));

  const qualified = score >= 60 ? 1 : 0;
  const reason = qualified
    ? `Lead qualifies (score: ${score}/100)`
    : `Lead needs more info — missing: ${missing.join(', ')}`;

  db.prepare(
    `UPDATE leads SET qualified = ?, qualification_notes = ?, updated_at = ? WHERE id = ?`,
  ).run(qualified, reason, new Date().toISOString(), leadId);

  logActivity(
    'lead_qualified',
    `Qualified lead ${leadId}: score ${score}/100 — ${qualified ? 'PASS' : 'NEEDS INFO'}`,
    { lead_id: leadId, score, qualified: !!qualified, missing: missing.length ? missing : null },
    lead.organization_id,
  );

  return { score, reason };
}

// ──────────────────────────────────────────────
// 3. findAvailablePartner
// ──────────────────────────────────────────────

export function findAvailablePartner(leadId: string): Partner | null {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead | undefined;

  if (!lead) {
    logActivity('find_partner_failed', `Lead ${leadId} not found`, { lead_id: leadId }, null, 'failed');
    return null;
  }

  // Find active partners whose trade_type matches the lead's service_category
  const partners = db.prepare(
    `SELECT * FROM partners
     WHERE trade_type = ?
       AND is_active = 1
     ORDER BY rating DESC, total_jobs DESC`,
  ).all(lead.service_category) as Partner[];

  if (partners.length === 0) {
    logActivity(
      'find_partner_no_match',
      `No active partners found for "${lead.service_category}"`,
      { lead_id: leadId, service_category: lead.service_category },
      lead.organization_id,
    );
    return null;
  }

  // Filter by service area (city/state match)
  const candidates: Partner[] = [];

  for (const partner of partners) {
    let areas: string[] = [];
    try {
      areas = JSON.parse(partner.service_areas || '[]');
    } catch {
      areas = [];
    }

    // If no service areas defined, consider the partner as matching location
    const locationMatch =
      areas.length === 0 ||
      areas.some((area: string) => {
        const lower = area.toLowerCase();
        return (
          (lead.city && lower.includes(lead.city.toLowerCase())) ||
          (lead.state && lower.includes(lead.state.toLowerCase()))
        );
      });

    if (!locationMatch) continue;

    // Check calendar availability — if calendar_json is present, ensure it has slots
    let hasAvailability = true;
    if (partner.calendar_json) {
      try {
        const calendar = JSON.parse(partner.calendar_json);
        const days = Object.values(calendar);
        hasAvailability = days.some((slots: unknown) =>
          Array.isArray(slots) && slots.length > 0,
        );
      } catch {
        hasAvailability = true; // treat unparseable calendar as "unknown" — allow
      }
    }

    if (hasAvailability) {
      candidates.push(partner);
    }
  }

  if (candidates.length === 0) {
    logActivity(
      'find_partner_no_availability',
      `No available partners for "${lead.service_category}" near ${lead.city ?? 'unknown'}, ${lead.state ?? 'unknown'}`,
      { lead_id: leadId, service_category: lead.service_category, city: lead.city, state: lead.state },
      lead.organization_id,
    );
    return null;
  }

  // Pick best partner (highest rated)
  const best = candidates[0];

  logActivity(
    'partner_found',
    `Found partner "${best.company_name}" for lead ${leadId}`,
    { lead_id: leadId, partner_id: best.id, company_name: best.company_name, candidates_found: candidates.length },
    lead.organization_id,
  );

  return best;
}

// ──────────────────────────────────────────────
// 4. bookAppointment
// ──────────────────────────────────────────────

export function bookAppointment(
  leadId: string,
  partnerId: string,
  scheduledDate: string,
  scheduledTime: string,
): Booking {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId) as Lead | undefined;
  if (!lead) {
    logActivity('booking_failed', `Lead ${leadId} not found`, { lead_id: leadId }, null, 'failed');
    throw new Error(`Lead ${leadId} not found`);
  }

  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(partnerId) as Partner | undefined;
  if (!partner) {
    logActivity('booking_failed', `Partner ${partnerId} not found`, { lead_id: leadId, partner_id: partnerId }, lead.organization_id, 'failed');
    throw new Error(`Partner ${partnerId} not found`);
  }

  const bookingId = generateId();
  const now = new Date().toISOString();

  // Determine organization_id — prefer partner's org, fallback to lead's
  const orgId = partner.organization_id || lead.organization_id;

  const booking: Booking = {
    id: bookingId,
    lead_id: leadId,
    partner_id: partnerId,
    organization_id: orgId,
    customer_name: lead.customer_name,
    customer_phone: lead.customer_phone,
    customer_email: lead.customer_email,
    service_category: lead.service_category,
    description: lead.description,
    property_address: lead.property_address,
    scheduled_date: scheduledDate,
    scheduled_time: scheduledTime,
    duration_minutes: 120,
    status: 'confirmed',
    estimated_cost_cents: null,
    final_cost_cents: null,
    partner_notes: null,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };

  db.prepare(
    `INSERT INTO bookings (
      id, lead_id, partner_id, organization_id,
      customer_name, customer_phone, customer_email,
      service_category, description, property_address,
      scheduled_date, scheduled_time, duration_minutes,
      status, estimated_cost_cents, final_cost_cents,
      partner_notes, completed_at, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?
    )`,
  ).run(
    booking.id, booking.lead_id, booking.partner_id, booking.organization_id,
    booking.customer_name, booking.customer_phone, booking.customer_email,
    booking.service_category, booking.description, booking.property_address,
    booking.scheduled_date, booking.scheduled_time, booking.duration_minutes,
    booking.status, booking.estimated_cost_cents, booking.final_cost_cents,
    booking.partner_notes, booking.completed_at, booking.created_at, booking.updated_at,
  );

  // Update lead status to 'booked'
  db.prepare(
    `UPDATE leads SET status = 'booked', partner_id = ?, updated_at = ? WHERE id = ?`,
  ).run(partnerId, now, leadId);

  logActivity(
    'booking_created',
    `Booked ${lead.service_category} for ${lead.customer_name} with ${partner.company_name} on ${scheduledDate} at ${scheduledTime}`,
    {
      booking_id: bookingId,
      lead_id: leadId,
      partner_id: partnerId,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
    },
    orgId,
  );

  return booking;
}

// ──────────────────────────────────────────────
// 5. getPartnerSchedule
// ──────────────────────────────────────────────

export function getPartnerSchedule(partnerId: string, date?: string): Booking[] {
  const targetDate = date ?? new Date().toISOString().split('T')[0];

  const bookings = db.prepare(
    `SELECT * FROM bookings
     WHERE partner_id = ?
       AND scheduled_date = ?
     ORDER BY scheduled_time ASC`,
  ).all(partnerId, targetDate) as Booking[];

  logActivity(
    'schedule_viewed',
    `Fetched schedule for partner ${partnerId} on ${targetDate} — ${bookings.length} booking(s)`,
    { partner_id: partnerId, date: targetDate, booking_count: bookings.length },
  );

  return bookings;
}
