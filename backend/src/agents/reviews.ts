import db from '../database';
import { generateId } from '../utils/helpers';

interface Job {
  id: string;
  booking_id: string;
  partner_id: string;
  organization_id: string;
  customer_name: string;
  service_category: string;
  final_cost_cents: number;
  our_fee_cents: number;
  partner_payout_cents: number;
  stripe_payment_intent_id: string | null;
  status: string;
  customer_rating: number | null;
  customer_review: string | null;
  review_requested: number;
  review_responded: number;
  completed_at: string | null;
  created_at: string;
}

interface Partner {
  id: string;
  organization_id: string;
  company_name: string;
  rating: number;
  review_count: number;
}

type RatingDistribution = { [key: string]: number };
// Convenience type for star-level lookups
type StarKey = '1star' | '2star' | '3star' | '4star' | '5star';

interface PartnerStats {
  avgRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

function logActivity(
  organizationId: string,
  actionType: string,
  actionSummary: string,
  details?: string,
): void {
  db.prepare(
    `INSERT INTO agent_activity_log (id, organization_id, agent_name, action_type, action_summary, details, status)
     VALUES (?, ?, 'Reviews', ?, ?, ?, 'completed')`,
  ).run(generateId(), organizationId, actionType, actionSummary, details || '');
}

/**
 * Mark a job as having had its review requested.
 */
export function requestReview(jobId: string): { requested: boolean; jobId: string } {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as Job | undefined;

  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  db.prepare('UPDATE jobs SET review_requested = 1 WHERE id = ?').run(jobId);

  logActivity(
    job.organization_id,
    'review_requested',
    `Review requested for job ${jobId} (${job.customer_name})`,
    JSON.stringify({ jobId, customerName: job.customer_name }),
  );

  return { requested: true, jobId };
}

/**
 * Submit a customer review (rating 1-5) for a completed job.
 * Recalculates the partner's average rating and review count.
 */
export function submitReview(
  jobId: string,
  rating: number,
  reviewText: string,
): Job {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5');
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as Job | undefined;

  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  // Store the review on the job
  db.prepare(
    'UPDATE jobs SET customer_rating = ?, customer_review = ?, review_responded = 1 WHERE id = ?',
  ).run(rating, reviewText, jobId);

  // Recalculate partner average rating
  const reviews = db
    .prepare(
      'SELECT customer_rating FROM jobs WHERE partner_id = ? AND customer_rating IS NOT NULL AND review_responded = 1',
    )
    .all(job.partner_id) as Pick<Job, 'customer_rating'>[];

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + (r.customer_rating as number), 0) /
            totalReviews) *
            10,
        ) / 10
      : 0;

  db.prepare('UPDATE partners SET rating = ?, review_count = ? WHERE id = ?').run(
    avgRating,
    totalReviews,
    job.partner_id,
  );

  logActivity(
    job.organization_id,
    'review_submitted',
    `Review submitted for job ${jobId} by ${job.customer_name} — rating: ${rating}/5`,
    JSON.stringify({
      jobId,
      partnerId: job.partner_id,
      rating,
      reviewText,
      newAvgRating: avgRating,
      totalReviews,
    }),
  );

  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as Job;
  return updated;
}

/**
 * Get all completed jobs where a review has not been requested yet,
 * within the given number of days back (default: 7).
 */
export function getUnreviewedJobs(daysBack: number = 7): Job[] {
  const jobs = db
    .prepare(
      `SELECT * FROM jobs
       WHERE status = 'completed'
         AND review_requested = 0
         AND completed_at >= datetime('now', ? || ' days')`,
    )
    .all(`-${daysBack}`) as Job[];

  return jobs;
}

/**
 * Run a review cycle — request reviews for all eligible completed jobs.
 */
export function runReviewCycle(): { requested: number } {
  const jobs = db
    .prepare(
      "SELECT * FROM jobs WHERE status = 'completed' AND review_requested = 0",
    )
    .all() as Job[];

  const requested = jobs.length;

  for (const job of jobs) {
    db.prepare('UPDATE jobs SET review_requested = 1 WHERE id = ?').run(job.id);

    logActivity(
      job.organization_id,
      'review_requested',
      `[Review Cycle] Review requested for job ${job.id} (${job.customer_name})`,
      JSON.stringify({
        jobId: job.id,
        customerName: job.customer_name,
        partnerId: job.partner_id,
      }),
    );
  }

  logActivity(
    'system',
    'review_cycle',
    `Review cycle completed — requested ${requested} review(s)`,
    JSON.stringify({ requested }),
  );

  return { requested };
}

/**
 * Get aggregated stats for a partner's reviews.
 */
export function getPartnerStats(partnerId: string): PartnerStats {
  const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(partnerId) as
    | Partner
    | undefined;

  if (!partner) {
    throw new Error(`Partner ${partnerId} not found`);
  }

  const distribution = db
    .prepare(
      `SELECT customer_rating, COUNT(*) as count
       FROM jobs
       WHERE partner_id = ?
         AND customer_rating IS NOT NULL
         AND review_responded = 1
       GROUP BY customer_rating`,
    )
    .all(partnerId) as { customer_rating: number; count: number }[];

  const ratingDistribution: RatingDistribution = {};
  const stars: StarKey[] = ['1star', '2star', '3star', '4star', '5star'];
  for (const s of stars) ratingDistribution[s] = 0;

  for (const row of distribution) {
    if (row.customer_rating >= 1 && row.customer_rating <= 5) {
      const key = `${row.customer_rating}star` as keyof RatingDistribution;
      ratingDistribution[key] = row.count;
    }
  }

  return {
    avgRating: partner.rating,
    totalReviews: partner.review_count,
    ratingDistribution,
  };
}
