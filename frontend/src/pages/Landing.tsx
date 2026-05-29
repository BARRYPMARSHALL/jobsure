export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <span className="text-lg font-bold text-white">JobSure</span>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Pay-Per-Booked-Appointment</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Partner Login</a>
            <a href="#how-it-works" className="text-sm bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-2 rounded-lg transition-colors">Become a Partner</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Now onboarding trade partners in your area</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Stop paying for<br />
            <span className="text-emerald-400">worthless leads</span>.<br />
            Pay <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">per booked appointment</span>.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl">
            JobSure is a ghost-managed lead generation network for trade contractors. 
            We find customers, qualify them, book appointments, and manage reviews — 
            <strong className="text-white"> you just show up and do the work</strong>.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#how-it-works" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3.5 rounded-lg transition-colors text-lg">
              See How It Works →
            </a>
            <a href="#faq" className="border border-slate-700 hover:border-slate-600 text-slate-300 px-8 py-3.5 rounded-lg transition-colors text-lg">
              Questions? FAQ
            </a>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800 pt-10">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">$0</div>
            <div className="text-sm text-slate-500 mt-1">Upfront cost to join</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">15%</div>
            <div className="text-sm text-slate-500 mt-1">Per completed booking</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">100%</div>
            <div className="text-sm text-slate-500 mt-1">Qualified, real leads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">24h</div>
            <div className="text-sm text-slate-500 mt-1">Typical booking time</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We run the entire customer acquisition machine. You get a calendar full of confirmed appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="relative">
              <div className="text-5xl mb-4">🎯</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">STEP 1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">We Find & Qualify Customers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our sensing agents monitor local demand across HVAC, plumbing, roofing, electrical, landscaping, and handyman services. Every lead is scored (0–100) for budget, urgency, and likelihood to book. <strong className="text-slate-300">No tire-kickers. No junk.</strong>
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-10 -left-4 text-emerald-500/30 text-2xl">⟶</div>
              <div className="text-5xl mb-4">📅</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">STEP 2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">We Book & Confirm</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Once qualified, we match the lead to the best partner based on trade, location, availability, and rating. The appointment is booked, confirmed via SMS, and added to your calendar. <strong className="text-slate-300">You just show up.</strong>
              </p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-10 -left-4 text-emerald-500/30 text-2xl">⟶</div>
              <div className="text-5xl mb-4">💰</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">STEP 3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Job Done. You Get Paid.</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complete the job, and we handle the rest — payment processing, customer follow-up, review requests, and rating updates. <strong className="text-slate-300">You only pay your 15% when the job is done.</strong>
              </p>
            </div>
          </div>

          {/* Agent flywheel visualization */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 md:p-8 mt-8">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Behind the Scenes — Our AI Agent Flywheel</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: '🤖', name: 'Sensing Agent', desc: 'Monitors market demand + competitor activity' },
                { emoji: '🎯', name: 'Intake Agent', desc: 'Qualifies leads, scores, matches partners' },
                { emoji: '📋', name: 'Marketing Agent', desc: 'Generates SEO pages + ad copy automatically' },
                { emoji: '⭐', name: 'Reviews Agent', desc: 'Chases customer reviews, updates ratings' },
              ].map(a => (
                <div key={a.name} className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">{a.emoji}</div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1">{a.name}</div>
                  <div className="text-xs text-slate-500">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trades We Cover</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              We're building exclusive partnerships across every major home service category.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'HVAC Repair', icon: '❄️', desc: 'Heating, AC, ventilation' },
              { name: 'Plumbing', icon: '🔧', desc: 'Pipes, drains, water heaters' },
              { name: 'Roofing', icon: '🏠', desc: 'Repair, replacement, leak detection' },
              { name: 'Electrical', icon: '⚡', desc: 'Wiring, panels, outlets' },
              { name: 'Landscaping', icon: '🌿', desc: 'Lawn, tree service, hardscape' },
              { name: 'Handyman', icon: '🛠️', desc: 'General home repair & maintenance' },
            ].map(cat => (
              <div key={cat.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{cat.name}</span>
                </div>
                <p className="text-xs text-slate-500">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Contractors */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-emerald-400 font-medium">For Trade Contractors</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Deal Is Simple</h2>
              <ul className="space-y-4">
                {[
                  { icon: '✅', text: 'No monthly fees. No membership tiers. No minimums.' },
                  { icon: '✅', text: 'Every lead is qualified before you see it — score, budget, location verified.' },
                  { icon: '✅', text: 'Appointments are pre-booked with confirmed time slots. No back-and-forth.' },
                  { icon: '✅', text: 'We chase the reviews. Your rating builds automatically.' },
                  { icon: '✅', text: `Exclusive territories — we don't flood your area with competitors.` },
                  { icon: '✅', text: 'Owner dashboard shows your pipeline, earnings, and ratings in real-time.' },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">{item.icon}</span>
                    <span className="text-slate-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🔧</div>
                <h3 className="text-xl font-bold">Ready to grow your business?</h3>
                <p className="text-sm text-slate-500 mt-2">Join our exclusive partner network. Limited spots per trade per area.</p>
              </div>
              <div className="space-y-3">
                <input placeholder="Your Company Name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500" />
                <input placeholder="Email Address" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500" />
                <input placeholder="Phone Number" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500" />
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300">
                  <option value="">Select your trade</option>
                  <option>HVAC Repair</option><option>Plumbing</option><option>Roofing</option>
                  <option>Electrical</option><option>Landscaping</option><option>General Handyman</option>
                </select>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3 rounded-lg transition-colors text-sm">
                  Apply Now — It's Free
                </button>
                <p className="text-xs text-slate-600 text-center">No commitment. We'll reach out within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I get paid for completed jobs?', a: 'We handle all payment processing through Stripe. Once a job is marked complete, the customer pays, we take our 15% fee, and the remaining balance is deposited to your account on file.' },
              { q: 'What if a customer cancels?', a: 'If the appointment was confirmed and the customer cancels with less than 24 hours notice, you still receive a cancellation fee (typically 50% of the booking value). No-show? Full fee.' },
              { q: 'How are partners vetted?', a: 'Every partner is manually reviewed. We verify license numbers, insurance coverage, and check references. Only 1 in 3 applicants are accepted — we protect your reputation by keeping the network exclusive.' },
              { q: 'Is there an exclusive territory?', a: 'Yes. We limit the number of partners per trade per city. First qualified partner in your trade/area gets exclusivity, subject to performance minimums (minimum 4 jobs/month).' },
              { q: 'How are leads generated?', a: 'Multiple channels: SEO-optimized landing pages, paid search ads (when configured), referral program, and automated local outreach. Our marketing agent generates fresh content daily.' },
              { q: 'What if I need to pause or take a vacation?', a: 'You can pause incoming leads anytime from your partner dashboard. Set availability in your calendar and we won\'t book during blackout periods.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">🔧</div>
          <h2 className="text-3xl font-bold mb-4">Ready to stop chasing leads?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join JobSure. We fill your calendar with qualified, confirmed appointments. You do what you do best.
          </p>
          <a href="#how-it-works" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3.5 rounded-lg transition-colors text-lg">
            Become a Partner →
          </a>
          <p className="text-xs text-slate-600 mt-4">Already a partner? <a href="/login" className="text-emerald-400 hover:underline">Log in</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>🔧</span>
            <span>JobSure — Pay-Per-Booked-Appointment Trade Lead Network</span>
          </div>
          <div className="text-xs text-slate-600">
            Built with Hermes Agent · Ghost-Managed by AI
          </div>
        </div>
      </footer>
    </div>
  );
}
