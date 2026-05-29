export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-lg border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-emerald-400">Job</span>Sure
            </span>
            <span className="hidden sm:block text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">
              Pay-Per-Booked-Appointment
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/login" className="text-sm text-white/50 hover:text-white/90 transition-colors">Sign In</a>
            <a href="#pricing" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              Join as Partner
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-24 px-6 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400/90 font-medium tracking-wide uppercase">
              Exclusive territories — one contractor per trade per city
            </span>
          </div>

          <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.0] tracking-tight mb-7">
            Stop renting leads.<br />
            <span className="text-emerald-400">Start owning demand.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-[580px] mb-14 leading-relaxed">
            JobSure is a ghost-managed lead generation network for premium local trade contractors.
            We sense demand, capture it, qualify it, and book the appointment — fully autonomously.
            <strong className="text-white/80"> You pay only when the job is actually booked.</strong>
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-x-0 gap-y-5 border-t border-white/[0.06] pt-10">
            {[
              { num: '$2,500+', label: 'True cost per customer on Angi' },
              { num: '1 in 3', label: 'Contractors close on shared leads' },
              { num: '$0', label: 'To you per inquiry — only per booked job' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-0 flex-1 min-w-[160px]">
                <div className="flex-1">
                  <span className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-emerald-400 block leading-none">
                    {s.num}
                  </span>
                  <span className="text-xs text-white/30 uppercase tracking-[0.06em] mt-1.5 block leading-tight">
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className="w-px h-14 bg-white/[0.06] mx-6 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS / PROBLEM VS SOLUTION ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-3">
            The Problem
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-14">
            You're paying for leads<br className="hidden md:block" /> your competitors already bought.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '✕',
                title: 'You pay for every lead — even the ones your competitor books',
                desc: 'Platforms like Angi and HomeAdvisor sell the same lead to 3-5 contractors simultaneously. First to answer wins. Everyone else pays full price for nothing.',
              },
              {
                icon: '⚠',
                title: 'You\'re always on the clock — literally',
                desc: '35-50% of jobs go to the contractor who responds first. If you\'re on a job site with a nail gun, the lead is already gone. You\'re paying for your competitor\'s booked appointment.',
              },
              {
                icon: '↑',
                title: 'Costs keep climbing. Leads keep degrading.',
                desc: 'Lead costs rose 15-30% in 2024. The FTC fined HomeAdvisor $7.2M for deceptive practices. Contractors are paying more for worse leads, every single month.',
              },
            ].map(p => (
              <div key={p.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-7 hover:border-emerald-500/20 hover:bg-white/[0.05] transition-all group">
                <div className="text-emerald-400 font-bold text-lg mb-4">{p.icon}</div>
                <h4 className="font-semibold text-sm mb-3 leading-snug text-white/90">{p.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Solution divider */}
          <div className="relative my-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0f] px-6 text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400">
                The JobSure Solution
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Exclusive leads — zero competition',
                desc: 'One contractor per trade per metro. No shared leads. No bidding wars. When a lead comes in, it\'s yours — booked and confirmed.',
              },
              {
                icon: '🤖',
                title: 'Autonomous 24/7 capture',
                desc: 'Sensing agents monitor local demand around the clock. Landing pages spin up automatically. Chat agents qualify and book while you sleep.',
              },
              {
                icon: '💰',
                title: 'Pay only on booked jobs',
                desc: 'No monthly minimums. No per-lead fees. You only pay our platform fee when a confirmed appointment is completed. Results-only pricing.',
              },
            ].map(s => (
              <div key={s.title} className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-7">
                <div className="text-2xl mb-4">{s.icon}</div>
                <h4 className="font-semibold text-sm mb-3 text-white/90">{s.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLYWHEEL / HOW IT WORKS ─── */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-3 text-center">
            The JobSure Flywheel
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Fully autonomous. Exclusive leads.<br />One job booked at a time.
          </h3>
          <p className="text-white/40 text-center max-w-xl mx-auto mb-14">
            Four autonomous agents working in sequence — no human intervention required.
          </p>

          {/* Desktop flywheel */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {[
              {
                num: '01',
                title: 'Sensing',
                desc: 'We monitor community forums, real estate listings, storm reports, weather data, and local demand signals in real time — catching demand before it hits Google.',
                color: 'from-emerald-500/20 to-emerald-500/5',
              },
              {
                num: '02',
                title: 'Attract',
                desc: 'Dynamic landing pages spin up for local demand spikes. Weather events trigger immediate ad copy updates. We meet homeowners exactly where they\'re searching.',
                color: 'from-emerald-500/15 to-emerald-500/3',
              },
              {
                num: '03',
                title: 'Intake',
                desc: 'Chat agents capture and qualify every inbound lead instantly. Budget, timeline, job type — all scored automatically. No missed calls. No cold leads.',
                color: 'from-emerald-500/10 to-emerald-500/2',
              },
              {
                num: '04',
                title: 'Book',
                desc: 'Live calendar availability is checked against your partnered contractors. Slots are booked in real time. The appointment lands in their calendar — confirmed.',
                color: 'from-emerald-500/5 to-emerald-500/1',
              },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                <div className={`bg-gradient-to-b ${step.color} border border-white/[0.06] rounded-xl p-7 h-full`}>
                  <span className="text-3xl font-extrabold text-emerald-400 block mb-4">{step.num}</span>
                  <h4 className="font-bold text-base mb-3">{step.title}</h4>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-white/15 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile flywheel */}
          <div className="md:hidden space-y-4">
            {[
              {
                num: '01',
                title: 'Sensing',
                desc: 'We monitor community forums, real estate listings, storm reports, weather data, and local demand signals in real time.',
              },
              {
                num: '02',
                title: 'Attract',
                desc: 'Dynamic landing pages spin up for local demand spikes. Weather events trigger immediate ad copy updates.',
              },
              {
                num: '03',
                title: 'Intake',
                desc: 'Chat agents capture and qualify every inbound lead instantly. Budget, timeline, job type — all scored automatically.',
              },
              {
                num: '04',
                title: 'Book',
                desc: 'Live calendar availability is checked. Slots booked in real time. The appointment lands confirmed.',
              },
            ].map((step, i) => (
              <div key={step.num} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex gap-4 items-start">
                <span className="text-2xl font-extrabold text-emerald-400 shrink-0">{step.num}</span>
                <div>
                  <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXCLUSIVE TERRITORY ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-3">
                Exclusive By Design
              </h2>
              <h3 className="text-4xl font-bold mb-6 leading-tight">
                One contractor per trade.<br />Per metro area.
              </h3>
              <p className="text-white/50 leading-relaxed mb-4">
                No shared leads. No bidding wars. No racing to answer while you're on a job site.
              </p>
              <p className="text-white/50 leading-relaxed">
                We lock in one HVAC company, one plumber, one roofer per territory. When demand hits,
                that contractor gets the lead — booked and confirmed — before anyone else even knows
                it exists. <strong className="text-white/80">Your only job: show up and do the work.</strong>
              </p>
            </div>
            <div className="space-y-5">
              {[
                { num: '100%', label: 'Exclusive leads — zero competition' },
                { num: '24/7', label: 'Autonomous lead capture — no missed calls' },
                { num: '1 human', label: 'Lock in partnerships, watch revenue stack' },
              ].map(s => (
                <div key={s.label} className="bg-white/[0.03] border-l-4 border-emerald-400 border border-white/[0.06] rounded-r-xl p-6">
                  <span className="text-3xl font-extrabold text-emerald-400 block leading-none">{s.num}</span>
                  <span className="text-xs text-white/40 uppercase tracking-[0.06em] mt-1.5 block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.02] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-400 mb-3 text-center">
            Simple. Results-Based.
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose your partnership model
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Per Booked Job */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-7 flex flex-col">
              <div className="text-xs font-semibold tracking-[0.12em] uppercase text-emerald-400 mb-4">
                Per Booked Job
              </div>
              <div className="text-3xl font-extrabold mb-8">
                <span className="text-emerald-400">15%</span>
                <span className="text-sm font-normal text-white/30 block mt-1">per completed appointment</span>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  'Exclusive territory (your trade, your metro)',
                  'Full sensing + landing page system',
                  '24/7 intake + qualification agents',
                  'Real-time calendar booking',
                  'Review chasing + rating management',
                ].map(f => (
                  <li key={f} className="text-sm text-white/50 flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#how-it-works" className="mt-8 w-full text-center border border-white/[0.12] hover:border-emerald-500/40 text-white/80 hover:text-white font-medium text-sm py-3 rounded-lg transition-all">
                Get Started
              </a>
            </div>

            {/* Retainer */} 
            <div className="bg-emerald-500/[0.04] border-2 border-emerald-500/30 rounded-xl p-7 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold tracking-[0.1em] uppercase px-4 py-1 rounded-md">
                Most Popular
              </div>
              <div className="text-xs font-semibold tracking-[0.12em] uppercase text-emerald-400 mb-4">
                Retainer
              </div>
              <div className="text-3xl font-extrabold mb-8">
                <span className="text-emerald-400">Custom</span>
                <span className="text-sm font-normal text-white/30 block mt-1">per territory</span>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  'Exclusive territory + priority ranking',
                  'Full sensing + landing page system',
                  '24/7 intake + qualification agents',
                  'Real-time calendar booking',
                  'Guaranteed minimum booked jobs',
                  'Weather-triggered campaign boosts',
                  'Dedicated account management',
                ].map(f => (
                  <li key={f} className="text-sm text-white/50 flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#how-it-works" className="mt-8 w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/20">
                Talk to Us
              </a>
            </div>

            {/* Hybrid */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-7 flex flex-col">
              <div className="text-xs font-semibold tracking-[0.12em] uppercase text-emerald-400 mb-4">
                Hybrid
              </div>
              <div className="text-3xl font-extrabold mb-8">
                <span className="text-emerald-400">Retainer + 10%</span>
                <span className="text-sm font-normal text-white/30 block mt-1">booking fee on top</span>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  'Exclusive territory + minimum guarantee',
                  'Full sensing + landing page system',
                  '24/7 intake + qualification agents',
                  'Real-time calendar booking',
                  'Priority intake during demand spikes',
                  'Reduced per-booking fee (10% vs 15%)',
                  'Dedicated account management',
                  'Monthly performance review',
                ].map(f => (
                  <li key={f} className="text-sm text-white/50 flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#how-it-works" className="mt-8 w-full text-center border border-white/[0.12] hover:border-emerald-500/40 text-white/80 hover:text-white font-medium text-sm py-3 rounded-lg transition-all">
                Get Started
              </a>
            </div>
          </div>

          <p className="text-xs text-white/20 text-center mt-8 max-w-lg mx-auto">
            All plans include territory exclusivity, autonomous intake agents, and full booking integration. No hidden fees.
          </p>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight mb-7">
            Stop renting leads.<br />Start owning demand.
          </h2>
          <p className="text-white/50 leading-relaxed mb-5">
            The local trade market is broken. Contractors pay thousands per month for leads
            their competitors also bought, never see, or can't convert. <strong className="text-white/80">JobSure fixes that — permanently.</strong>
          </p>
          <p className="text-white/50 leading-relaxed mb-10">
            We run the entire lead machine. You run the business. And when a job is booked,
            you know exactly where it came from.
          </p>
          <a href="#pricing" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3.5 rounded-lg transition-all text-base hover:shadow-lg hover:shadow-emerald-500/20">
            Become a Partner →
          </a>
          <p className="text-xs text-white/20 mt-4">
            Already a partner? <a href="/login" className="text-emerald-400/70 hover:text-emerald-400 transition-colors">Sign in</a>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm text-white/30">
            <span className="font-bold tracking-tight">
              <span className="text-emerald-400">Job</span>Sure
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em]">Ghost-managed lead generation for local trade contractors</span>
          </div>
          <span className="text-[11px] text-white/15">
            © {new Date().getFullYear()} JobSure. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
