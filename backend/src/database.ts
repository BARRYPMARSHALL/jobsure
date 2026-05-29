import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'jobsure.db');
let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function initializeDatabase(): void {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      city TEXT, state TEXT, created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, organization_id TEXT, email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'partner',
      phone TEXT, partner_id TEXT, created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Trade partner companies
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
      trade_type TEXT NOT NULL, service_areas TEXT NOT NULL DEFAULT '[]',
      license_number TEXT, insurance_verified INTEGER DEFAULT 0,
      calendar_json TEXT, -- JSON: availability schedule
      is_active INTEGER DEFAULT 1, onboarding_complete INTEGER DEFAULT 0,
      stripe_account_id TEXT, monthly_retainer_cents INTEGER,
      per_booking_fee_cents INTEGER DEFAULT 3000, -- $30 default
      total_jobs INTEGER DEFAULT 0, total_revenue_cents INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0, review_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Service categories
    CREATE TABLE IF NOT EXISTS service_categories (
      id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
      description TEXT, avg_job_value_cents INTEGER DEFAULT 30000
    );

    -- Customer leads
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, organization_id TEXT, partner_id TEXT,
      customer_name TEXT NOT NULL, customer_email TEXT, customer_phone TEXT NOT NULL,
      service_category TEXT NOT NULL, description TEXT NOT NULL,
      property_address TEXT, city TEXT, state TEXT, zip TEXT,
      urgency TEXT DEFAULT 'normal', budget_range TEXT,
      source TEXT DEFAULT 'web', status TEXT DEFAULT 'new',
      qualified INTEGER DEFAULT 0, qualification_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Booked appointments
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY, lead_id TEXT NOT NULL, partner_id TEXT NOT NULL,
      organization_id TEXT, customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL, customer_email TEXT,
      service_category TEXT NOT NULL, description TEXT,
      property_address TEXT, scheduled_date TEXT NOT NULL,
      scheduled_time TEXT, duration_minutes INTEGER DEFAULT 120,
      status TEXT DEFAULT 'confirmed', -- confirmed, in_progress, completed, cancelled, no_show
      estimated_cost_cents INTEGER, final_cost_cents INTEGER,
      partner_notes TEXT, cancelled_at TEXT, completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Completed jobs
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY, booking_id TEXT NOT NULL, partner_id TEXT NOT NULL,
      organization_id TEXT, customer_name TEXT NOT NULL,
      service_category TEXT NOT NULL, final_cost_cents INTEGER NOT NULL,
      our_fee_cents INTEGER NOT NULL, partner_payout_cents INTEGER NOT NULL,
      stripe_payment_intent_id TEXT, status TEXT DEFAULT 'completed',
      customer_rating INTEGER, customer_review TEXT,
      review_requested INTEGER DEFAULT 0, review_responded INTEGER DEFAULT 0,
      completed_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Dynamic landing pages (SEO)
    CREATE TABLE IF NOT EXISTS landing_pages (
      id TEXT PRIMARY KEY, organization_id TEXT, partner_id TEXT,
      slug TEXT NOT NULL, title TEXT NOT NULL, h1 TEXT,
      meta_description TEXT, service_category TEXT, city TEXT,
      state TEXT, content_json TEXT, is_active INTEGER DEFAULT 1,
      views INTEGER DEFAULT 0, leads_generated INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Agent activity log
    CREATE TABLE IF NOT EXISTS agent_activity_log (
      id TEXT PRIMARY KEY, organization_id TEXT, agent_name TEXT NOT NULL,
      action_type TEXT NOT NULL, action_summary TEXT NOT NULL,
      details TEXT, status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- OS Framework tables
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY, organization_id TEXT, name TEXT NOT NULL,
      domain TEXT NOT NULL, steps TEXT NOT NULL, triggers TEXT,
      inputs TEXT, outputs TEXT, exceptions TEXT, tools_used TEXT,
      frequency TEXT, owner TEXT, estimated_hours_monthly REAL,
      ai_readiness INTEGER DEFAULT 0, is_documented INTEGER DEFAULT 0,
      notes TEXT, created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sensing_events (
      id TEXT PRIMARY KEY, organization_id TEXT, category TEXT NOT NULL,
      source TEXT, title TEXT NOT NULL, description TEXT,
      severity TEXT DEFAULT 'info', url TEXT,
      detected_at TEXT DEFAULT (datetime('now')),
      is_actionable INTEGER DEFAULT 0, action_taken TEXT,
      resolved_at TEXT, created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_outcomes (
      id TEXT PRIMARY KEY, organization_id TEXT, agent_name TEXT NOT NULL,
      action_type TEXT NOT NULL, input_summary TEXT, output_summary TEXT,
      outcome TEXT DEFAULT 'unknown', success_score INTEGER,
      lessons TEXT, improvement_suggestions TEXT, reviewed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_checkpoints (
      id TEXT PRIMARY KEY, organization_id TEXT, agent_name TEXT NOT NULL,
      snapshot_type TEXT NOT NULL, snapshot_data TEXT NOT NULL,
      checksum TEXT, parent_checkpoint_id TEXT, status TEXT DEFAULT 'active',
      rolled_back_at TEXT, created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS human_review_queue (
      id TEXT PRIMARY KEY, organization_id TEXT, agent_name TEXT NOT NULL,
      action_type TEXT NOT NULL, description TEXT NOT NULL,
      context_data TEXT, status TEXT DEFAULT 'pending',
      reviewed_by TEXT, reviewed_at TEXT, reviewer_notes TEXT,
      checkpoint_id TEXT, created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed service categories
  const catCount = db.prepare('SELECT COUNT(*) as c FROM service_categories').get() as any;
  if (catCount.c === 0) {
    const catStmt = db.prepare('INSERT INTO service_categories (id, name, slug, description, avg_job_value_cents) VALUES (?, ?, ?, ?, ?)');
    const cats = [
      ['cat1', 'HVAC Repair', 'hvac-repair', 'Heating, ventilation, and air conditioning repair and installation', 35000],
      ['cat2', 'Plumbing', 'plumbing', 'Pipe repair, drain cleaning, water heater installation', 30000],
      ['cat3', 'Roofing', 'roofing', 'Roof repair, replacement, and leak detection', 75000],
      ['cat4', 'Electrical', 'electrical', 'Wiring, panel upgrades, outlet installation', 25000],
      ['cat5', 'Landscaping', 'landscaping', 'Lawn care, tree service, hardscaping', 20000],
      ['cat6', 'General Handyman', 'handyman', 'General home repair and maintenance', 15000],
    ];
    for (const c of cats) catStmt.run(...c);
  }

  console.log('[DB] JobSure database initialized');
}

// ====== Query Wrapper ======

function rowToObject(stmt: any): any {
  const cols = stmt.columns();
  const vals = stmt.raw();
  const obj: any = {};
  cols.forEach((c: string, i: number) => obj[c] = vals[i]);
  return obj;
}

const query = {
  prepare: (sql: string) => ({
    run: (...params: any[]) => {
      const d = getDb();
      const stmt = d.prepare(sql);
      const result = params.length ? stmt.run(...params) : stmt.run();
      return { changes: result.changes };
    },
    get: (...params: any[]) => {
      const d = getDb();
      const stmt = d.prepare(sql);
      if (params.length) stmt.bind(...params);
      const row = stmt.get();
      return row || undefined;
    },
    all: (...params: any[]) => {
      const d = getDb();
      const stmt = d.prepare(sql);
      if (params.length) stmt.bind(...params);
      return stmt.all();
    },
  }),
  run: (sql: string, params?: any[]) => {
    const d = getDb();
    const stmt = d.prepare(sql);
    return params ? stmt.run(...params) : stmt.run();
  },
};

export default query;
