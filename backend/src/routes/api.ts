import { Router, Request, Response } from 'express';
import db from '../database';
import { generateId } from '../utils/helpers';
import { authenticate, AuthRequest, hashPassword, comparePassword, generateToken } from '../middleware/auth';
import * as intake from '../agents/intake';
import * as reviews from '../agents/reviews';
import * as marketing from '../agents/marketing';
import * as sensing from '../agents/sensing';

// ── Main router ──────────────────────────────────────────────────
const router = Router();

// ── AUTH ──────────────────────────────────────────────────────────
const authRouter = Router();

authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone, partner_id, organization_id } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'email, password, and name are required' });
      return;
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const id = generateId();
    const hash = hashPassword(password);
    db.prepare(
      `INSERT INTO users (id, organization_id, email, password_hash, name, role, phone, partner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, organization_id || null, email, hash, name, role || 'partner', phone || null, partner_id || null);

    const token = generateToken(id, role || 'partner');
    res.status(201).json({
      token,
      user: { id, email, name, role: role || 'partner', organization_id: organization_id || null },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user || !comparePassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization_id: user.organization_id,
        partner_id: user.partner_id,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, email, name, role, organization_id, partner_id, phone FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/auth', authRouter);

// ── PARTNERS ──────────────────────────────────────────────────────
const partnersRouter = Router();

partnersRouter.get('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    let sql = 'SELECT * FROM partners WHERE 1=1';
    const params: any[] = [];

    if (req.query.trade_type) {
      sql += ' AND trade_type = ?';
      params.push(req.query.trade_type);
    }
    if (req.query.city) {
      sql += ' AND service_areas LIKE ?';
      params.push(`%${req.query.city}%`);
    }

    sql += ' ORDER BY created_at DESC';
    const partners = db.prepare(sql).all(...params);
    res.json({ partners });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

partnersRouter.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!partner) {
      res.status(404).json({ error: 'Partner not found' });
      return;
    }
    res.json({ partner });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

partnersRouter.post('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const {
      organization_id, company_name, contact_name, email, phone,
      trade_type, service_areas, license_number, insurance_verified,
      calendar_json, is_active, per_booking_fee_cents,
    } = req.body;

    if (!organization_id || !company_name || !contact_name || !email || !phone || !trade_type) {
      res.status(400).json({ error: 'organization_id, company_name, contact_name, email, phone, and trade_type are required' });
      return;
    }

    const id = generateId();
    db.prepare(
      `INSERT INTO partners (
        id, organization_id, company_name, contact_name, email, phone,
        trade_type, service_areas, license_number, insurance_verified,
        calendar_json, is_active, per_booking_fee_cents
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id, organization_id, company_name, contact_name, email, phone,
      trade_type, service_areas || '[]', license_number || null,
      insurance_verified || 0, calendar_json || null,
      is_active !== undefined ? is_active : 1,
      per_booking_fee_cents || 3000,
    );

    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(id);
    res.status(201).json({ partner });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

partnersRouter.put('/:id', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const existing = db.prepare('SELECT id FROM partners WHERE id = ?').get(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Partner not found' });
      return;
    }

    const fields = [
      'company_name', 'contact_name', 'email', 'phone', 'trade_type',
      'service_areas', 'license_number', 'insurance_verified',
      'calendar_json', 'is_active', 'per_booking_fee_cents',
    ];

    const updates: string[] = [];
    const params: any[] = [];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push("updated_at = datetime('now')");
    params.push(req.params.id);

    db.prepare(`UPDATE partners SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    res.json({ partner });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

partnersRouter.get('/:id/schedule', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const date = req.query.date as string | undefined;
    const schedule = intake.getPartnerSchedule(req.params.id, date);
    res.json({ schedule });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

partnersRouter.get('/:id/stats', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const stats = reviews.getPartnerStats(req.params.id);
    res.json({ stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/partners', partnersRouter);

// ── LEADS ─────────────────────────────────────────────────────────
const leadsRouter = Router();

leadsRouter.post('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const lead = intake.captureLead(req.body);
    res.status(201).json({ lead });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

leadsRouter.get('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    let sql = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    if (req.query.status) {
      sql += ' AND status = ?';
      params.push(req.query.status);
    }
    if (req.query.partner_id) {
      sql += ' AND partner_id = ?';
      params.push(req.query.partner_id);
    }

    sql += ' ORDER BY created_at DESC';
    const leads = db.prepare(sql).all(...params);
    res.json({ leads });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

leadsRouter.post('/:id/qualify', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const result = intake.qualifyLead(req.params.id);
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

leadsRouter.post('/:id/match', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const partner = intake.findAvailablePartner(req.params.id);
    if (!partner) {
      res.status(404).json({ error: 'No available partner found for this lead' });
      return;
    }
    res.json({ partner });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

leadsRouter.post('/:id/book', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { partner_id, scheduled_date, scheduled_time } = req.body;
    if (!partner_id || !scheduled_date || !scheduled_time) {
      res.status(400).json({ error: 'partner_id, scheduled_date, and scheduled_time are required' });
      return;
    }
    const booking = intake.bookAppointment(req.params.id, partner_id, scheduled_date, scheduled_time);
    res.status(201).json({ booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/leads', leadsRouter);

// ── BOOKINGS ──────────────────────────────────────────────────────
const bookingsRouter = Router();

bookingsRouter.get('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params: any[] = [];

    if (req.query.partner_id) {
      sql += ' AND partner_id = ?';
      params.push(req.query.partner_id);
    }
    if (req.query.status) {
      sql += ' AND status = ?';
      params.push(req.query.status);
    }
    if (req.query.date) {
      sql += ' AND scheduled_date = ?';
      params.push(req.query.date);
    }

    sql += ' ORDER BY scheduled_date DESC, scheduled_time ASC';
    const bookings = db.prepare(sql).all(...params);
    res.json({ bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

bookingsRouter.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

bookingsRouter.put('/:id/status', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    const existing = db.prepare('SELECT id FROM bookings WHERE id = ?').get(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const updates: string[] = ['status = ?', "updated_at = datetime('now')"];
    const params: any[] = [status];

    if (status === 'completed') {
      updates.push("completed_at = datetime('now')");
    }

    params.push(req.params.id);
    db.prepare(`UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    res.json({ booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

bookingsRouter.get('/:id/job', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as any;
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Check if job already exists for this booking
    const existingJob = db.prepare('SELECT * FROM jobs WHERE booking_id = ?').get(req.params.id);
    if (existingJob) {
      res.json({ job: existingJob });
      return;
    }

    // Create a new job record from the completed booking
    const jobId = generateId();
    const finalCost = booking.final_cost_cents || booking.estimated_cost_cents || 0;
    const ourFee = Math.round(finalCost * 0.15); // 15% platform fee
    const partnerPayout = finalCost - ourFee;

    const job = {
      id: jobId,
      booking_id: booking.id,
      partner_id: booking.partner_id,
      organization_id: booking.organization_id,
      customer_name: booking.customer_name,
      service_category: booking.service_category,
      final_cost_cents: finalCost,
      our_fee_cents: ourFee,
      partner_payout_cents: partnerPayout,
      stripe_payment_intent_id: null,
      status: 'completed',
      customer_rating: null,
      customer_review: null,
      review_requested: 0,
      review_responded: 0,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    db.prepare(
      `INSERT INTO jobs (
        id, booking_id, partner_id, organization_id, customer_name,
        service_category, final_cost_cents, our_fee_cents, partner_payout_cents,
        stripe_payment_intent_id, status, customer_rating, customer_review,
        review_requested, review_responded, completed_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      job.id, job.booking_id, job.partner_id, job.organization_id, job.customer_name,
      job.service_category, job.final_cost_cents, job.our_fee_cents, job.partner_payout_cents,
      job.stripe_payment_intent_id, job.status, job.customer_rating, job.customer_review,
      job.review_requested, job.review_responded, job.completed_at, job.created_at,
    );

    // Update booking status to completed if not already
    if (booking.status !== 'completed') {
      db.prepare("UPDATE bookings SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?")
        .run(job.completed_at, job.completed_at, booking.id);
    }

    res.status(201).json({ job });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/bookings', bookingsRouter);

// ── JOBS ──────────────────────────────────────────────────────────
const jobsRouter = Router();

jobsRouter.get('/', authenticate, (req: AuthRequest, res: Response) => {
  try {
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params: any[] = [];

    if (req.query.partner_id) {
      sql += ' AND partner_id = ?';
      params.push(req.query.partner_id);
    }
    if (req.query.service_category) {
      sql += ' AND service_category = ?';
      params.push(req.query.service_category);
    }

    sql += ' ORDER BY created_at DESC';
    const jobs = db.prepare(sql).all(...params);
    res.json({ jobs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

jobsRouter.get('/:id', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ job });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/jobs', jobsRouter);

// ── REVIEWS ───────────────────────────────────────────────────────
const reviewsRouter = Router();

reviewsRouter.post('/request/:jobId', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const result = reviews.requestReview(req.params.jobId);
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.post('/submit/:jobId', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { rating, review_text } = req.body;
    if (rating === undefined || !review_text) {
      res.status(400).json({ error: 'rating and review_text are required' });
      return;
    }
    const job = reviews.submitReview(req.params.jobId, Number(rating), review_text);
    res.json({ job });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.post('/run-cycle', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const result = reviews.runReviewCycle();
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

reviewsRouter.get('/pending', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const days = req.query.days ? Number(req.query.days) : 7;
    const jobs = reviews.getUnreviewedJobs(days);
    res.json({ jobs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/reviews', reviewsRouter);

// ── MARKETING ─────────────────────────────────────────────────────
const marketingRouter = Router();

marketingRouter.post('/landing-pages', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { partner_id, service_category, city, state } = req.body;
    if (!partner_id || !service_category || !city || !state) {
      res.status(400).json({ error: 'partner_id, service_category, city, and state are required' });
      return;
    }
    const page = marketing.generateLandingPage(partner_id, service_category, city, state);
    res.status(201).json({ page });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

marketingRouter.get('/landing-pages', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const city = req.query.city as string | undefined;
    const serviceCategory = req.query.service_category as string | undefined;
    const pages = marketing.getActiveLandingPages(city, serviceCategory);
    res.json({ pages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

marketingRouter.post('/landing-pages/:id/view', authenticate, (req: AuthRequest, res: Response) => {
  try {
    marketing.incrementPageView(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

marketingRouter.get('/ad-copy', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { service_category, city, event } = req.query;
    if (!service_category || !city) {
      res.status(400).json({ error: 'service_category and city are required' });
      return;
    }
    const adCopy = marketing.generateAdCopy(
      service_category as string,
      city as string,
      event as any,
    );
    res.json({ adCopy });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

marketingRouter.post('/refresh', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const result = marketing.runContentRefresh();
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/marketing', marketingRouter);

// ── SENSING ───────────────────────────────────────────────────────
const sensingRouter = Router();

sensingRouter.post('/events', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { organization_id, category, title, description, severity, url } = req.body;
    if (!organization_id || !category || !title || !description) {
      res.status(400).json({ error: 'organization_id, category, title, and description are required' });
      return;
    }
    const event = sensing.logSensingEvent(organization_id, category, title, description, severity, url);
    res.status(201).json({ event });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensingRouter.get('/events', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.query.organization_id as string;
    if (!orgId) {
      res.status(400).json({ error: 'organization_id query parameter is required' });
      return;
    }
    const category = req.query.category as any;
    const actionable = req.query.actionable !== undefined ? Number(req.query.actionable) : undefined;
    const days = req.query.days !== undefined ? Number(req.query.days) : undefined;
    const events = sensing.getSensingEvents(orgId, category, actionable, days);
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensingRouter.get('/urgent', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.query.organization_id as string;
    if (!orgId) {
      res.status(400).json({ error: 'organization_id query parameter is required' });
      return;
    }
    const events = sensing.getUrgentEvents(orgId);
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensingRouter.get('/report', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.query.organization_id as string;
    if (!orgId) {
      res.status(400).json({ error: 'organization_id query parameter is required' });
      return;
    }
    const report = sensing.generateSensingReport(orgId);
    res.json({ report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

sensingRouter.post('/events/:id/resolve', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { action_taken } = req.body;
    if (!action_taken) {
      res.status(400).json({ error: 'action_taken is required' });
      return;
    }
    const event = sensing.resolveEvent(req.params.id, action_taken);
    res.json({ event });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/sensing', sensingRouter);

// ── SERVICE CATEGORIES ────────────────────────────────────────────
const serviceCategoriesRouter = Router();

serviceCategoriesRouter.get('/', (req: Request, res: Response) => {
  try {
    const categories = db.prepare('SELECT * FROM service_categories ORDER BY name ASC').all();
    res.json({ categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.use('/service-categories', serviceCategoriesRouter);

export default router;
