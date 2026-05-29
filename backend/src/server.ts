import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import cron from 'node-cron';
import { initializeDatabase, getDb } from './database';
import { errorHandler, notFound } from './middleware/auth';
import apiRoutes from './routes/api';

const PORT = parseInt(process.env.PORT || '3101', 10);

const app = express();

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('short'));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Owner Dashboard (business metrics)
import db from './database';
import { Router, Response } from 'express';
import { authenticate, AuthRequest } from './middleware/auth';

const ownerRouter = Router();

ownerRouter.get('/dashboard', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const totalPartners = db.prepare('SELECT COUNT(*) as c FROM partners WHERE is_active = 1').get() as any;
    const totalLeads = db.prepare('SELECT COUNT(*) as c FROM leads').get() as any;
    const qualifiedLeads = db.prepare('SELECT COUNT(*) as c FROM leads WHERE qualified = 1').get() as any;
    const totalBookings = db.prepare('SELECT COUNT(*) as c FROM bookings').get() as any;
    const completedJobs = db.prepare('SELECT COUNT(*) as c FROM jobs').get() as any;
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(final_cost_cents), 0) as c FROM jobs').get() as any;
    const platformFees = db.prepare('SELECT COALESCE(SUM(our_fee_cents), 0) as c FROM jobs').get() as any;
    const bookingsToday = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE date(scheduled_date) = date('now')").get() as any;
    const leads30d = db.prepare("SELECT COUNT(*) as c FROM leads WHERE created_at > datetime('now', '-30 days')").get() as any;
    const bookingRate = db.prepare("SELECT COUNT(*) as c FROM leads WHERE status = 'booked'").get() as any;
    const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get() as any;

    // Conversion rate
    const conversionRate = totalLeads?.c > 0 ? Math.round((bookingRate?.c / totalLeads?.c) * 100) : 0;

    // Revenue breakdown
    const revenueByMonth = db.prepare(
      `SELECT strftime('%Y-%m', completed_at) as month, SUM(our_fee_cents) as fees
       FROM jobs GROUP BY month ORDER BY month DESC LIMIT 6`
    ).all() as any[];

    // Lead source breakdown
    const leadsBySource = db.prepare(
      'SELECT source, COUNT(*) as count FROM leads GROUP BY source ORDER BY count DESC'
    ).all() as any[];

    // Bookings this week
    const bookingsThisWeek = db.prepare(
      `SELECT COUNT(*) as c FROM bookings WHERE scheduled_date >= date('now', 'weekday 0', '-7 days')`
    ).get() as any;

    // Agent activity
    const agent24h = db.prepare(
      "SELECT COUNT(*) as c FROM agent_activity_log WHERE created_at > datetime('now', '-24 hours')"
    ).get() as any;
    const agentErrors = db.prepare(
      "SELECT COUNT(*) as c FROM agent_activity_log WHERE status = 'failed' AND created_at > datetime('now', '-24 hours')"
    ).get() as any;
    const agentBreakdown = db.prepare(
      `SELECT agent_name, COUNT(*) as count FROM agent_activity_log WHERE created_at > datetime('now', '-7 days') GROUP BY agent_name ORDER BY count DESC`
    ).all() as any[];

    // Recent activity
    const recentActivity = db.prepare(
      'SELECT created_at, agent_name, action_type, action_summary, status FROM agent_activity_log ORDER BY created_at DESC LIMIT 10'
    ).all() as any[];

    // OS Framework metrics
    const workflowCount = db.prepare('SELECT COUNT(*) as c FROM workflows').get() as any;
    const sensing7d = db.prepare("SELECT COUNT(*) as c FROM sensing_events WHERE detected_at > datetime('now', '-7 days')").get() as any;
    const criticalSensing = db.prepare("SELECT COUNT(*) as c FROM sensing_events WHERE severity IN ('critical','warning') AND is_actionable = 1 AND resolved_at IS NULL").get() as any;
    const totalOutcomes = db.prepare('SELECT COUNT(*) as c FROM agent_outcomes').get() as any;
    const failedOutcomes = db.prepare("SELECT COUNT(*) as c FROM agent_outcomes WHERE outcome = 'failure'").get() as any;
    const activeCheckpoints = db.prepare("SELECT COUNT(*) as c FROM agent_checkpoints WHERE status = 'active'").get() as any;
    const pendingReviews = db.prepare("SELECT COUNT(*) as c FROM human_review_queue WHERE status = 'pending'").get() as any;

    res.json({
      summary: {
        partners: totalPartners?.c || 0,
        leads: totalLeads?.c || 0,
        qualifiedLeads: qualifiedLeads?.c || 0,
        bookings: totalBookings?.c || 0,
        completedJobs: completedJobs?.c || 0,
        bookingsToday: bookingsToday?.c || 0,
        bookingsThisWeek: bookingsThisWeek?.c || 0,
      },
      revenue: {
        totalRevenueCents: totalRevenue?.c || 0,
        totalRevenueDollars: Math.round((totalRevenue?.c || 0) / 100),
        platformFeesCents: platformFees?.c || 0,
        platformFeesDollars: Math.round((platformFees?.c || 0) / 100),
        monthlyBreakdown: revenueByMonth,
      },
      conversion: {
        totalLeads: totalLeads?.c || 0,
        booked: bookingRate?.c || 0,
        conversionRate,
        leads30d: leads30d?.c || 0,
      },
      leadsBySource,
      agents: {
        activity24h: agent24h?.c || 0,
        errors24h: agentErrors?.c || 0,
        breakdown7d: agentBreakdown,
      },
      recentActivity,
      system: {
        totalUsers: totalUsers?.c || 0,
      },
      osFramework: {
        tacitKnowledge: { workflows: workflowCount?.c || 0 },
        sensing: { events7d: sensing7d?.c || 0, criticalActionable: criticalSensing?.c || 0 },
        learning: { totalOutcomes: totalOutcomes?.c || 0, failures: failedOutcomes?.c || 0 },
        governance: { activeCheckpoints: activeCheckpoints?.c || 0, pendingReviews: pendingReviews?.c || 0 },
      },
    });
  } catch (err: any) {
    console.error('[Owner Dashboard] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', ownerRouter);

// OS Framework routes (tacit knowledge, learning, governance)
import {
  captureWorkflow, interviewWorkflow, getWorkflows,
  calculateAiReadiness, generateAutomationPlan
} from './agents/tacit-knowledge';
import {
  logOutcome, getRecentOutcomes, getFailurePatterns,
  generateImprovements, runLearningCycle
} from './agents/learning';
import {
  createCheckpoint, rollbackToCheckpoint, getCheckpoints,
  queueForReview, reviewAction, getPendingReviews, getReviewStats
} from './agents/governance';

const osRouter = Router();

// Tacit Knowledge
osRouter.post('/os/tacit/workflows', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json(captureWorkflow({ ...req.body, organizationId: req.body.organization_id })); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/tacit/workflows', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.query.organization_id as string;
    res.json({ workflows: getWorkflows(orgId, req.query.domain as string) });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.post('/os/tacit/interview', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json({ questions: interviewWorkflow(req.body.organization_id, req.body.domain) }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Learning
osRouter.post('/os/learning/outcomes', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const { organization_id, agent_name, action_type, input_summary, output_summary, outcome, success_score, lessons, suggestions } = req.body;
    res.json(logOutcome(organization_id, agent_name, action_type, input_summary, output_summary, outcome, success_score, lessons, suggestions));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/learning/outcomes', authenticate, (req: AuthRequest, res: Response) => {
  try {
    res.json({ outcomes: getRecentOutcomes(req.query.organization_id as string, req.query.agent_name as string, req.query.days ? parseInt(req.query.days as string) : undefined) });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/learning/failure-patterns', authenticate, (req: AuthRequest, res: Response) => {
  try {
    res.json(getFailurePatterns(req.query.organization_id as string, req.query.days ? parseInt(req.query.days as string) : undefined));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.post('/os/learning/cycle', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json(runLearningCycle(req.body.organization_id)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

// Governance
osRouter.post('/os/governance/checkpoints', authenticate, (req: AuthRequest, res: Response) => {
  try {
    res.json(createCheckpoint(req.body.organization_id, req.body.agent_name, req.body.snapshot_type, req.body.snapshot_data));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/governance/checkpoints', authenticate, (req: AuthRequest, res: Response) => {
  try {
    res.json({ checkpoints: getCheckpoints(req.query.organization_id as string, req.query.agent_name as string, req.query.status as string) });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.post('/os/governance/checkpoints/:id/rollback', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const snapshot = rollbackToCheckpoint(req.params.id);
    res.json({ rolled_back: !!snapshot, snapshot_data: snapshot });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.post('/os/governance/reviews', authenticate, (req: AuthRequest, res: Response) => {
  try {
    res.json(queueForReview(req.body.organization_id, req.body.agent_name, req.body.action_type, req.body.description, req.body.context_data, req.body.checkpoint_id));
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/governance/reviews', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json({ reviews: getPendingReviews(req.query.organization_id as string) }); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.post('/os/governance/reviews/:id/decide', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json(reviewAction(req.params.id, req.userId!, req.body.decision, req.body.notes)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});
osRouter.get('/os/governance/reviews/stats', authenticate, (req: AuthRequest, res: Response) => {
  try { res.json(getReviewStats(req.query.organization_id as string)); }
  catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.use('/api', osRouter);

// Serve frontend — try multiple possible locations
function findFrontendDist(): string {
  const candidates = [
    path.join(__dirname, '../../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    path.join(__dirname, '../frontend/dist'),
    '/app/frontend/dist',
    '/frontend/dist',
  ];
  for (const p of candidates) {
    try { if (require('fs').statSync(path.join(p, 'index.html')).isFile()) return p; }
    catch { continue; }
  }
  console.warn('[Frontend] No frontend dist found at any candidate path, using fallback:', candidates[0]);
  return candidates[0];
}
const frontendDist = findFrontendDist();
console.log('[Frontend] Serving static from:', frontendDist);
app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (req.path.includes('.')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), err => {
    if (err) {
      console.warn('[Frontend] Cannot send index.html:', err.message);
      res.status(200).send('<html><head><title>JobSure API</title></head><body><h1>JobSure API</h1><p>Backend running. Frontend build pending.</p><p>Endpoints at <code>/api/*</code></p></body></html>');
    }
  });
});

app.use(notFound);
app.use(errorHandler);

// Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔧 JobSure listening on 0.0.0.0:${PORT}`);
  initializeDatabase();
  console.log('[Bootstrap] DB ready');

  // Schedules
  cron.schedule('0 7 * * *', async () => {
    console.log('[Cron] Daily review cycle...');
    try {
      const { runReviewCycle } = require('./agents/reviews');
      const result = runReviewCycle();
      console.log(`[Cron] Review cycle: ${result.requested} requested`);
    } catch (e: any) { console.error('[Cron] Review cycle failed:', e.message); }
  });

  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Sensing report...');
    try {
      const { generateSensingReport } = require('./agents/sensing');
      console.log('[Cron] Sensing report available');
    } catch (e: any) { console.error('[Cron] Sensing failed:', e.message); }
  });

  cron.schedule('0 */12 * * *', async () => {
    console.log('[Cron] Content refresh...');
    try {
      const { runContentRefresh } = require('./agents/marketing');
      const result = runContentRefresh();
      console.log(`[Cron] Content refresh: ${result.refreshed} pages`);
    } catch (e: any) { console.error('[Cron] Content refresh failed:', e.message); }
  });

  console.log('[Bootstrap] All systems active — JobSure is live.');
});
