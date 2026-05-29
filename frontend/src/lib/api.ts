const API_BASE = '/api';
let authToken: string | null = localStorage.getItem('jobsure_token');

export function setToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem('jobsure_token', token);
  else localStorage.removeItem('jobsure_token');
}

export function getToken(): string | null {
  return authToken;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    setToken(null);
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),

  // Partners
  partners: () => request('/partners'),
  getPartner: (id: string) => request(`/partners/${id}`),
  createPartner: (data: any) => request('/partners', { method: 'POST', body: JSON.stringify(data) }),
  updatePartner: (id: string, data: any) => request(`/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getPartnerSchedule: (id: string) => request(`/partners/${id}/schedule`),
  getPartnerStats: (id: string) => request(`/partners/${id}/stats`),

  // Leads
  leads: () => request('/leads'),
  captureLead: (data: any) => request('/leads', { method: 'POST', body: JSON.stringify(data) }),
  qualifyLead: (id: string) => request(`/leads/${id}/qualify`, { method: 'POST' }),
  matchLead: (id: string) => request(`/leads/${id}/match`, { method: 'POST' }),
  bookLead: (id: string, data: any) => request(`/leads/${id}/book`, { method: 'POST', body: JSON.stringify(data) }),

  // Bookings
  bookings: (params?: string) => request(`/bookings${params ? `?${params}` : ''}`),
  updateBookingStatus: (id: string, status: string) =>
    request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createJobFromBooking: (id: string) => request(`/bookings/${id}/job`, { method: 'GET' }),

  // Jobs
  jobs: () => request('/jobs'),

  // Reviews
  requestReview: (jobId: string) => request(`/reviews/request/${jobId}`, { method: 'POST' }),
  submitReview: (jobId: string, rating: number, reviewText: string) =>
    request(`/reviews/submit/${jobId}`, { method: 'POST', body: JSON.stringify({ rating, review_text: reviewText }) }),
  runReviewCycle: () => request('/reviews/run-cycle', { method: 'POST' }),
  pendingReviews: () => request('/reviews/pending'),

  // Marketing
  landingPages: (params?: string) => request(`/marketing/landing-pages${params ? `?${params}` : ''}`),
  generateLandingPage: (data: any) => request('/marketing/landing-pages', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  ownerDashboard: () => request('/dashboard'),

  // Service categories
  serviceCategories: () => request('/service-categories'),

  // Sensing
  urgentEvents: () => request('/sensing/urgent'),
  sensingReport: () => request('/sensing/report'),
};
