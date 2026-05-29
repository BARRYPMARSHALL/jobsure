import db from '../database';
import { generateId } from '../utils/helpers';

/**
 * Log an action to the agent_activity_log table.
 */
function logAction(
  actionType: string,
  actionSummary: string,
  status: string = 'completed',
  organizationId?: string,
  details?: string,
): void {
  db.prepare(
    `INSERT INTO agent_activity_log (id, organization_id, agent_name, action_type, action_summary, details, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
  ).run(
    generateId(),
    organizationId || null,
    'Marketing/SEO Agent',
    actionType,
    actionSummary,
    details || null,
    status,
  );
}

/**
 * SEO-friendly title helpers.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate a human-readable, SEO-optimized title for a landing page.
 */
function buildSeoTitle(serviceCategory: string, city: string, state: string): string {
  return `Top ${serviceCategory} Services in ${city}, ${state} | JobSure`;
}

function buildSeoH1(serviceCategory: string, city: string, state: string): string {
  return `Expert ${serviceCategory} Services in ${city}, ${state}`;
}

function buildSeoMetaDescription(serviceCategory: string, city: string, state: string): string {
  return `Looking for reliable ${serviceCategory.toLowerCase()} in ${city}, ${state}? JobSure connects you with licensed, insured professionals. Fast quotes & same-day service available.`;
}

// ──────────────────────────────────────────────────
// 1. generateLandingPage
// ──────────────────────────────────────────────────

interface LandingPage {
  id: string;
  organization_id: string | null;
  partner_id: string | null;
  slug: string;
  title: string;
  h1: string | null;
  meta_description: string | null;
  service_category: string | null;
  city: string | null;
  state: string | null;
  content_json: string | null;
  is_active: number;
  views: number;
  leads_generated: number;
  created_at: string;
  updated_at: string;
}

export function generateLandingPage(
  partnerId: string,
  serviceCategory: string,
  city: string,
  state: string,
): LandingPage {
  const slug = `${slugify(serviceCategory)}/${slugify(city)}-${slugify(state)}`;
  const title = buildSeoTitle(serviceCategory, city, state);
  const h1 = buildSeoH1(serviceCategory, city, state);
  const metaDescription = buildSeoMetaDescription(serviceCategory, city, state);

  // Look up the partner to get organization_id
  const partner = db.prepare('SELECT id, organization_id FROM partners WHERE id = ?').get(partnerId) as
    | { id: string; organization_id: string }
    | undefined;

  if (!partner) {
    logAction('generate_landing_page', `Partner ${partnerId} not found`, 'failed', undefined, `partnerId: ${partnerId}`);
    throw new Error(`Partner not found: ${partnerId}`);
  }

  const id = generateId();
  const contentJson = JSON.stringify({
    sections: [
      { type: 'hero', heading: h1, text: `We connect you with top-rated ${serviceCategory.toLowerCase()} professionals in ${city}, ${state}.` },
      { type: 'services', heading: `Our ${serviceCategory} Services`, items: [] },
      { type: 'cta', heading: `Get a Free ${serviceCategory} Quote`, text: `Contact us today for reliable ${serviceCategory.toLowerCase()} service in ${city}.` },
    ],
  });

  db.prepare(
    `INSERT INTO landing_pages (id, organization_id, partner_id, slug, title, h1, meta_description, service_category, city, state, content_json, is_active, views, leads_generated, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, datetime('now'), datetime('now'))`,
  ).run(
    id,
    partner.organization_id,
    partnerId,
    slug,
    title,
    h1,
    metaDescription,
    serviceCategory,
    city,
    state,
    contentJson,
  );

  const page = db.prepare('SELECT * FROM landing_pages WHERE id = ?').get(id) as LandingPage;

  logAction(
    'generate_landing_page',
    `Generated landing page "${title}" for ${serviceCategory} in ${city}, ${state} (slug: ${slug})`,
    'completed',
    partner.organization_id,
    JSON.stringify({ partnerId, serviceCategory, city, state, pageId: id }),
  );

  return page;
}

// ──────────────────────────────────────────────────
// 2. getActiveLandingPages
// ──────────────────────────────────────────────────

export function getActiveLandingPages(
  city?: string,
  serviceCategory?: string,
): LandingPage[] {
  let sql = 'SELECT * FROM landing_pages WHERE is_active = 1';
  const params: any[] = [];

  if (city) {
    sql += ' AND city = ?';
    params.push(city);
  }
  if (serviceCategory) {
    sql += ' AND service_category = ?';
    params.push(serviceCategory);
  }

  sql += ' ORDER BY created_at DESC';

  const pages = db.prepare(sql).all(...params) as LandingPage[];

  logAction(
    'get_landing_pages',
    `Retrieved ${pages.length} active landing page(s)${city ? ` for city "${city}"` : ''}${serviceCategory ? ` for category "${serviceCategory}"` : ''}`,
    'completed',
  );

  return pages;
}

// ──────────────────────────────────────────────────
// 3. incrementPageView
// ──────────────────────────────────────────────────

export function incrementPageView(pageId: string): void {
  const page = db.prepare('SELECT id, slug FROM landing_pages WHERE id = ?').get(pageId) as
    | { id: string; slug: string }
    | undefined;

  if (!page) {
    logAction('increment_page_view', `Page ${pageId} not found`, 'failed', undefined, `pageId: ${pageId}`);
    throw new Error(`Landing page not found: ${pageId}`);
  }

  db.prepare('UPDATE landing_pages SET views = views + 1, updated_at = datetime(\'now\') WHERE id = ?').run(pageId);

  logAction(
    'increment_page_view',
    `Incremented view count for landing page "${page.slug}"`,
    'completed',
  );
}

// ──────────────────────────────────────────────────
// 4. generateAdCopy
// ──────────────────────────────────────────────────

interface AdCopy {
  headline: string;
  description: string;
  callToAction: string;
}

type AdEvent = 'storm' | 'seasonal' | 'emergency';

export function generateAdCopy(
  serviceCategory: string,
  city: string,
  event?: AdEvent,
): AdCopy {
  const templates: Record<AdEvent, { headline: (svc: string, c: string) => string; description: (svc: string, c: string) => string; callToAction: string }> = {
    storm: {
      headline: (svc, c) => `⚠️ Storm Damage? Get Emergency ${svc} in ${c} Now!`,
      description: (svc, c) =>
        `Severe weather hit ${c}? Don't wait — our ${svc.toLowerCase()} professionals are standing by for rapid response. Licensed, insured, and ready to help.`,
      callToAction: 'Call Now for Storm Recovery',
    },
    seasonal: {
      headline: (svc, c) => `Prepare Your Home This Season — ${svc} in ${c}`,
      description: (svc, c) =>
        `Get your home ready with trusted ${svc.toLowerCase()} services in ${c}. Reliable pros, transparent pricing, and same-day availability.`,
      callToAction: 'Schedule Your Service',
    },
    emergency: {
      headline: (svc, c) => `🚨 24/7 Emergency ${svc} in ${c} — We're Here!`,
      description: (svc, c) =>
        `After-hours ${svc.toLowerCase()} emergency in ${c}? Our network of licensed pros responds fast — day or night. No extra hidden fees.`,
      callToAction: 'Get Emergency Help Now',
    },
  };

  // Default to seasonal if no event is specified
  const templateKey: AdEvent = event || 'seasonal';
  const template = templates[templateKey];

  const adCopy: AdCopy = {
    headline: template.headline(serviceCategory, city),
    description: template.description(serviceCategory, city),
    callToAction: template.callToAction,
  };

  logAction(
    'generate_ad_copy',
    `Generated ${templateKey} ad copy for ${serviceCategory} in ${city}`,
    'completed',
    undefined,
    JSON.stringify({ serviceCategory, city, event: templateKey, adCopy }),
  );

  return adCopy;
}

// ──────────────────────────────────────────────────
// 5. runContentRefresh
// ──────────────────────────────────────────────────

export function runContentRefresh(): { refreshed: number } {
  // Find landing pages whose updated_at is more than 30 days old
  const stalePages = db.prepare(
    `SELECT * FROM landing_pages WHERE updated_at < datetime('now', '-30 days') AND is_active = 1 ORDER BY updated_at ASC`,
  ).all() as LandingPage[];

  let refreshedCount = 0;

  for (const page of stalePages) {
    const serviceCategory = page.service_category;
    const city = page.city;
    const state = page.state;

    if (!serviceCategory || !city || !state) {
      // Skip pages missing required fields
      continue;
    }

    // Build fresh SEO content
    const newTitle = buildSeoTitle(serviceCategory, city, state);
    const newH1 = buildSeoH1(serviceCategory, city, state);
    const newMetaDescription = buildSeoMetaDescription(serviceCategory, city, state);

    const contentJson = JSON.stringify({
      sections: [
        { type: 'hero', heading: newH1, text: `We connect you with top-rated ${serviceCategory.toLowerCase()} professionals in ${city}, ${state}.` },
        { type: 'services', heading: `Our ${serviceCategory} Services`, items: [] },
        { type: 'cta', heading: `Get a Free ${serviceCategory} Quote`, text: `Contact us today for reliable ${serviceCategory.toLowerCase()} service in ${city}.` },
      ],
    });

    db.prepare(
      `UPDATE landing_pages SET title = ?, h1 = ?, meta_description = ?, content_json = ?, updated_at = datetime('now') WHERE id = ?`,
    ).run(newTitle, newH1, newMetaDescription, contentJson, page.id);

    refreshedCount++;
  }

  logAction(
    'content_refresh',
    `Refreshed ${refreshedCount} stale landing page(s) (older than 30 days)`,
    'completed',
    undefined,
    JSON.stringify({ staleFound: stalePages.length, refreshed: refreshedCount }),
  );

  return { refreshed: refreshedCount };
}
