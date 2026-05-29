export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-emerald-500/30 selection:text-white">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold tracking-[-0.03em]">
              <span className="text-emerald-400">Job</span>
              <span className="text-white">Sure</span>
            </span>
            <span className="hidden sm:block text-[10px] text-[#64748b] uppercase tracking-[0.18em] font-semibold">
              Pay-Per-Booked-Appointment
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/login" className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-all duration-300 ease-in-out">
              Sign In
            </a>
            <a
              href="#pricing"
              className="relative overflow-hidden text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-lg
                         transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25
                         before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
            >
              Join as Partner
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden border-b border-white/[0.04]">
        {/* Radial glow behind hero */}
        <div
          className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-400/90 font-semibold tracking-[0.12em] uppercase">
              Exclusive territories — one contractor per trade per city
            </span>
          </div>

          <h1 className="text-[clamp(3rem,7.5vw,5.8rem)] font-extrabold leading-[0.95] tracking-[-0.03em] mb-7 text-white">
            Stop renting leads.<br />
            <span className="text-emerald-400">Start owning demand.</span>
          </h1>

          <p className="text-lg text-[#94a3b8] max-w-[580px] mb-14 leading-relaxed font-normal">
            JobSure is a ghost-managed lead generation network for premium local trade contractors.
            We sense demand, capture it, qualify it, and book the appointment — fully autonomously.
            <strong className="text-white font-semibold"> You pay only when the job is actually booked.</strong>
          </p>

          {/* Glass-morphic stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: '$2,500+', label: 'True cost per customer on Angi', sub: 'Industry average per closed lead' },
              { num: '1 in 3', label: 'Contractors close on shared leads', sub: 'Rest pay full price for nothing' },
              { num: '$0', label: 'To you per inquiry', sub: 'Only per booked job — results only' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="group rounded-xl p-6 transition-all duration-300 ease-in-out
                           hover:-translate-y-[3px] hover:shadow-xl hover:shadow-emerald-500/5
                           backdrop-blur-md"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <span className="text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold text-emerald-400 block leading-none tracking-tight">
                  {s.num}
                </span>
                <span className="text-sm text-[#94a3b8] font-medium mt-2 block leading-snug">
                  {s.label}
                </span>
                <span className="text-xs text-[#64748b] mt-1 block">
                  {s.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAIN POINTS / PROBLEM VS SOLUTION ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4">
            The Problem
          </h2>
          <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-[-0.02em] text-white mb-16 leading-tight">
            You're paying for leads<br className="hidden md:block" /> your competitors already bought.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '✕',
                title: 'You pay for every lead — even the ones your competitor books',
                desc: 'Platforms like Angi and HomeAdvisor sell the same lead to 3-5 contractors simultaneously. First to answer wins. Everyone else pays full price for nothing.',
              },
              {
                icon: '⚠',
                title: "You're always on the clock — literally",
                desc: "35-50% of jobs go to the contractor who responds first. If you're on a job site with a nail gun, the lead is already gone.",
              },
              {
                icon: '↑',
                title: 'Costs keep climbing. Leads keep degrading.',
                desc: 'Lead costs rose 15-30% in 2024. The FTC fined HomeAdvisor $7.2M for deceptive practices. You pay more for worse leads every month.',
              },
            ].map(p => (
              <div
                key={p.title}
                className="rounded-xl p-7 transition-all duration-300 ease-in-out
                           hover:-translate-y-[4px] hover:shadow-xl hover:shadow-emerald-500/5
                           group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div className="text-emerald-400 font-bold text-xl mb-4">{p.icon}</div>
                <h4 className="font-bold text-white text-sm mb-3 leading-snug">{p.title}</h4>
                <p className="text-sm text-[#64748b] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Solution divider */}
          <div className="relative my-20">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0f] px-8 text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">
                The JobSure Solution
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              <div
                key={s.title}
                className="rounded-xl p-7 transition-all duration-300 ease-in-out
                           hover:-translate-y-[4px] hover:shadow-xl hover:shadow-emerald-500/8
                           group"
                style={{
                  background: 'rgba(16,185,129,0.04)',
                  border: '1px solid rgba(16,185,129,0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)';
                  e.currentTarget.style.background = 'rgba(16,185,129,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.12)';
                  e.currentTarget.style.background = 'rgba(16,185,129,0.04)';
                }}
              >
                <div className="text-2xl mb-4">{s.icon}</div>
                <h4 className="font-bold text-white text-sm mb-3">{s.title}</h4>
                <p className="text-sm text-[#64748b] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLYWHEEL / HOW IT WORKS ─── */}
      <section className="relative py-28 px-6 overflow-hidden border-y border-white/[0.04]">
        {/* Subtle radial glow behind flywheel */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16,185,129,0.3) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4 text-center">
            The JobSure Flywheel
          </h2>
          <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-[-0.02em] text-white text-center mb-3 leading-tight">
            Fully autonomous. Exclusive leads.<br />One job booked at a time.
          </h3>
          <p className="text-[#64748b] text-center max-w-xl mx-auto mb-14 text-base leading-relaxed">
            Four autonomous agents working in sequence — no human intervention required.
          </p>

          {/* Desktop flywheel */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {[
              {
                num: '01',
                title: 'Sensing',
                desc: 'We monitor community forums, real estate listings, storm reports, weather data, and local demand signals in real time — catching demand before it hits Google.',
                grad: 'from-emerald-500/15 to-transparent',
              },
              {
                num: '02',
                title: 'Attract',
                desc: 'Dynamic landing pages spin up for local demand spikes. Weather events trigger immediate ad copy updates. We meet homeowners exactly where they\'re searching.',
                grad: 'from-emerald-500/12 to-transparent',
              },
              {
                num: '03',
                title: 'Intake',
                desc: 'Chat agents capture and qualify every inbound lead instantly. Budget, timeline, job type — all scored automatically. No missed calls. No cold leads.',
                grad: 'from-emerald-500/9 to-transparent',
              },
              {
                num: '04',
                title: 'Book',
                desc: 'Live calendar availability is checked against your partnered contractors. Slots are booked in real time. The appointment lands in their calendar — confirmed.',
                grad: 'from-emerald-500/6 to-transparent',
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="relative rounded-xl p-7 transition-all duration-300 ease-in-out
                           hover:-translate-y-[4px] hover:shadow-xl hover:shadow-emerald-500/8
                           group"
                style={{
                  background: `linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.015) 100%)`,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <span className="text-[2.2rem] font-extrabold text-emerald-400 block mb-4 leading-none tracking-tight">
                  {step.num}
                </span>
                <h4 className="font-bold text-white text-base mb-3">{step.title}</h4>
                <p className="text-sm text-[#64748b] leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden xl:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-lg font-light select-none">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile flywheel */}
          <div className="md:hidden space-y-3">
            {[
              {
                num: '01', title: 'Sensing',
                desc: 'We monitor community forums, real estate listings, storm reports, weather data, and local demand signals in real time.',
              },
              {
                num: '02', title: 'Attract',
                desc: 'Dynamic landing pages spin up for local demand spikes. Weather events trigger immediate ad copy updates.',
              },
              {
                num: '03', title: 'Intake',
                desc: 'Chat agents capture and qualify every inbound lead instantly. Budget, timeline, job type — all scored automatically.',
              },
              {
                num: '04', title: 'Book',
                desc: 'Live calendar availability is checked. Slots booked in real time. The appointment lands confirmed.',
              },
            ].map(step => (
              <div
                key={step.num}
                className="rounded-xl p-5 flex gap-4 items-start transition-all duration-300 ease-in-out"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span className="text-[1.6rem] font-extrabold text-emerald-400 leading-none shrink-0">{step.num}</span>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXCLUSIVE TERRITORY ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4">
                Exclusive By Design
              </h2>
              <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-[-0.02em] text-white mb-6 leading-tight">
                One contractor per trade.<br />Per metro area.
              </h3>
              <p className="text-[#94a3b8] leading-relaxed mb-4 text-base">
                No shared leads. No bidding wars. No racing to answer while you're on a job site.
              </p>
              <p className="text-[#64748b] leading-relaxed text-base">
                We lock in one HVAC company, one plumber, one roofer per territory. When demand hits,
                that contractor gets the lead — booked and confirmed — before anyone else even knows
                it exists. <strong className="text-white font-semibold">Your only job: show up and do the work.</strong>
              </p>
            </div>
            <div className="space-y-4">
              {[
                { num: '100%', label: 'Exclusive leads — zero competition' },
                { num: '24/7', label: 'Autonomous lead capture — no missed calls' },
                { num: '1 human', label: 'Lock in partnerships, watch revenue stack' },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl p-6 transition-all duration-300 ease-in-out
                             hover:-translate-y-[3px] hover:shadow-lg hover:shadow-emerald-500/5
                             group"
                  style={{
                    borderLeft: '4px solid rgba(16,185,129,0.5)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeftWidth: '4px',
                    borderLeftColor: 'rgba(16,185,129,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = 'rgba(16,185,129,0.9)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderLeftColor = 'rgba(16,185,129,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-emerald-400 block leading-none tracking-tight">
                    {s.num}
                  </span>
                  <span className="text-xs text-[#94a3b8] font-medium uppercase tracking-[0.08em] mt-2 block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="relative py-28 px-6 border-y border-white/[0.04] overflow-hidden">
        <div
          className="pointer-events-none absolute -bottom-48 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16,185,129,0.3) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4 text-center">
            Simple. Results-Based.
          </h2>
          <h3 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-[-0.02em] text-white text-center mb-14 leading-tight">
            Choose your partnership model
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Per Booked Job */}
            <div
              className="rounded-xl p-7 flex flex-col transition-all duration-300 ease-in-out
                         hover:-translate-y-[4px] hover:shadow-xl hover:shadow-emerald-500/5
                         group"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-5">
                Per Booked Job
              </div>
              <div className="mb-9">
                <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-white tracking-tight">15%</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">per completed appointment</span>
              </div>
              <ul className="space-y-3 flex-1">
                {[
                  'Exclusive territory (your trade, your metro)',
                  'Full sensing + landing page system',
                  '24/7 intake + qualification agents',
                  'Real-time calendar booking',
                  'Review chasing + rating management',
                ].map(f => (
                  <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#how-it-works"
                className="relative overflow-hidden mt-8 w-full text-center border border-white/[0.10] hover:border-emerald-500/30
                           text-[#94a3b8] hover:text-white font-semibold text-sm py-3 rounded-lg
                           transition-all duration-300 ease-in-out hover:scale-[1.01]"
              >
                Get Started
              </a>
            </div>

            {/* Retainer — featured */}
            <div
              className="relative rounded-xl p-7 flex flex-col transition-all duration-300 ease-in-out
                         hover:-translate-y-[4px] hover:shadow-2xl hover:shadow-emerald-500/15
                         group"
              style={{
                background: 'rgba(16,185,129,0.05)',
                border: '2px solid rgba(16,185,129,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.6)';
                e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)';
                e.currentTarget.style.background = 'rgba(16,185,129,0.05)';
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-md shadow-lg shadow-emerald-500/20">
                Most Popular
              </div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-5 pt-1">
                Retainer
              </div>
              <div className="mb-9">
                <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-white tracking-tight">Custom</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">per territory</span>
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
                  <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#how-it-works"
                className="relative overflow-hidden mt-8 w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-lg
                           transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25
                           before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
              >
                Talk to Us
              </a>
            </div>

            {/* Hybrid */}
            <div
              className="rounded-xl p-7 flex flex-col transition-all duration-300 ease-in-out
                         hover:-translate-y-[4px] hover:shadow-xl hover:shadow-emerald-500/5
                         group"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 mb-5">
                Hybrid
              </div>
              <div className="mb-9">
                <span className="text-[clamp(1.2rem,2.5vw,1.8rem)] font-extrabold text-white tracking-tight">Retainer + 10%</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">booking fee on top</span>
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
                  <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5 shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#how-it-works"
                className="relative overflow-hidden mt-8 w-full text-center border border-white/[0.10] hover:border-emerald-500/30
                           text-[#94a3b8] hover:text-white font-semibold text-sm py-3 rounded-lg
                           transition-all duration-300 ease-in-out hover:scale-[1.01]"
              >
                Get Started
              </a>
            </div>
          </div>

          <p className="text-xs text-[#64748b] text-center mt-8 max-w-lg mx-auto">
            All plans include territory exclusivity, autonomous intake agents, and full booking integration. No hidden fees.
          </p>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(16,185,129,0.3) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        <div className="max-w-[700px] mx-auto relative z-10">
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.02em] text-white leading-tight mb-7">
            Stop renting leads.<br />Start owning demand.
          </h2>
          <p className="text-[#94a3b8] leading-relaxed mb-5 text-base">
            The local trade market is broken. Contractors pay thousands per month for leads
            their competitors also bought, never see, or can't convert. <strong className="text-white font-semibold">JobSure fixes that — permanently.</strong>
          </p>
          <p className="text-[#64748b] leading-relaxed mb-10 text-base">
            We run the entire lead machine. You run the business. And when a job is booked,
            you know exactly where it came from.
          </p>
          <a
            href="#pricing"
            className="relative overflow-hidden inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-9 py-3.5 rounded-lg
                       transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25
                       before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none"
          >
            Become a Partner →
          </a>
          <p className="text-xs text-[#64748b] mt-5">
            Already a partner?{' '}
            <a href="/login" className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-300 ease-in-out font-medium">
              Sign in
            </a>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-extrabold tracking-[-0.03em]">
              <span className="text-emerald-400">Job</span>
              <span className="text-white/60">Sure</span>
            </span>
            <span className="text-[9px] text-[#64748b] uppercase tracking-[0.15em] font-semibold hidden sm:block">
              Ghost-managed lead generation for local trade contractors
            </span>
          </div>
          <span className="text-[10px] text-[#475569]">
            © {new Date().getFullYear()} JobSure. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
