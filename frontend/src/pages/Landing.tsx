export default function Landing() {
  const pain = [
    { icon: '\u2715', title: 'You pay for every lead \u2014 even the ones your competitor books', desc: 'Platforms like Angi and HomeAdvisor sell the same lead to 3\u20135 contractors simultaneously. First to answer wins. Everyone else pays full price for nothing.' },
    { icon: '\u26A0', title: "You\u2019re always on the clock \u2014 literally", desc: "35\u201350% of jobs go to the contractor who responds first. If you\u2019re on a job site with a nail gun, the lead is already gone." },
    { icon: '\u2191', title: 'Costs keep climbing. Leads keep degrading.', desc: 'Lead costs rose 15\u201330% in 2024. The FTC fined HomeAdvisor $7.2M for deceptive practices. You pay more for worse leads every single month.' },
  ];
  const fly = [
    { num: '01', title: 'Sensing', desc: 'We monitor community forums, real estate listings, storm reports, weather data, and local demand signals in real time \u2014 catching demand before it hits Google.' },
    { num: '02', title: 'Attract', desc: "Dynamic landing pages spin up for local demand spikes. Weather events trigger immediate ad copy updates. We meet homeowners where they\u2019re searching." },
    { num: '03', title: 'Intake', desc: 'Chat agents capture and qualify every inbound lead instantly. Budget, timeline, job type \u2014 all scored automatically. No missed calls. No cold leads.' },
    { num: '04', title: 'Book', desc: 'Live calendar availability is checked against your partnered contractors. Slots are booked in real time. The appointment lands confirmed.' },
  ];
  const p1 = ['Exclusive territory (your trade, your metro)', 'Full sensing + landing page system', '24/7 intake + qualification agents', 'Real-time calendar booking', 'Review chasing + rating management'];
  const p2 = ['Exclusive territory + priority ranking', 'Full sensing + landing page system', '24/7 intake + qualification agents', 'Real-time calendar booking', 'Guaranteed minimum booked jobs', 'Weather-triggered campaign boosts', 'Dedicated account management'];
  const p3 = ['Exclusive territory + minimum guarantee', 'Full sensing + landing page system', '24/7 intake + qualification agents', 'Real-time calendar booking', 'Priority intake during demand spikes', 'Reduced per-booking fee (10% vs 15%)', 'Dedicated account management', 'Monthly performance review'];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30">

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight uppercase"><span className="text-emerald-400">Job</span>Sure</span>
          <div className="flex items-center gap-5">
            <a href="/login" className="text-sm text-[#64748b] hover:text-white transition-colors">Sign In</a>
            <a href="#pricing" className="relative overflow-hidden text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">Join as Partner</a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden border-b border-white/5">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-400/90 font-semibold tracking-[0.12em] uppercase">Exclusive territories \u2014 one contractor per trade per city</span>
          </div>

          <h1 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.0] mb-6 text-white">
            Your Leads Handled.<br />Your Calendar Full.<br /><span className="text-emerald-400">Your Way.</span>
          </h1>

          <p className="text-base md:text-lg text-[#94a3b8] max-w-[560px] mb-14 leading-relaxed font-normal">
            JobSure is a ghost-managed lead generation network for premium local trade contractors. We sense demand, capture it, qualify it, and book the appointment \u2014 fully autonomously. <strong className="text-white font-semibold">You pay only when the job is actually booked.</strong>
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl">
            {[
              { num: '$2,500+', label: 'True cost per customer on Angi', sub: 'Industry average per closed lead' },
              { num: '1 in 3', label: 'Contractors close on shared leads', sub: 'Rest pay full price for nothing' },
              { num: '$0', label: 'To you per inquiry', sub: 'Only per booked job \u2014 results only' },
            ].map(function(v) {
              return (
                <div key={v.label} className="bg-[#0c0c12] border border-white/5 rounded-xl p-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04]">
                  <span className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-emerald-400 block leading-none tracking-tight">{v.num}</span>
                  <span className="text-sm text-[#94a3b8] font-medium mt-2 block leading-snug">{v.label}</span>
                  <span className="text-xs text-[#64748b] mt-1.5 block">{v.sub}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-4">The Problem</h2>
          <h3 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(1.6rem,3.5vw,2.6rem)] text-white mb-14 leading-tight">You\u2019re paying for leads your competitors already bought.</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pain.map(function(p) {
              return (
                <div key={p.title} className="bg-[#0c0c12] border border-white/5 rounded-xl p-8 transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04]">
                  <div className="text-emerald-400 font-bold text-xl mb-5">{p.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-3 leading-snug">{p.title}</h4>
                  <p className="text-sm text-[#64748b] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Solution bridge */}
          <div className="relative my-20">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center"><span className="bg-[#030303] px-8 font-sans font-extrabold tracking-[0.2em] uppercase text-[10px] text-emerald-400">The JobSure Solution</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '\uD83D\uDD12', title: 'Exclusive leads \u2014 zero competition', desc: "One contractor per trade per metro. No shared leads. No bidding wars. When a lead comes in, it\u2019s yours \u2014 booked and confirmed." },
              { icon: '\uD83E\uDD16', title: 'Autonomous 24/7 capture', desc: 'Sensing agents monitor local demand around the clock. Landing pages spin up automatically. Chat agents qualify and book while you sleep.' },
              { icon: '\uD83D\uDCB0', title: 'Pay only on booked jobs', desc: 'No monthly minimums. No per-lead fees. You only pay our platform fee when a confirmed appointment is completed. Results-only pricing.' },
            ].map(function(v) {
              return (
                <div key={v.title} className="bg-[#0c0c12] border border-emerald-500/15 rounded-xl p-8 transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/[0.05]">
                  <div className="text-2xl mb-5">{v.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-3">{v.title}</h4>
                  <p className="text-sm text-[#64748b] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FLYWHEEL ─── */}
      <section className="relative py-28 px-6 border-y border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-4 text-center">The JobSure Flywheel</h2>
          <h3 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(1.6rem,3.5vw,2.6rem)] text-white text-center mb-4 leading-tight">Fully autonomous. Exclusive leads. One job booked at a time.</h3>
          <p className="text-[#64748b] text-center max-w-xl mx-auto mb-14 text-sm leading-relaxed">Four autonomous agents working in sequence \u2014 no human intervention required.</p>
          <div className="hidden md:grid grid-cols-4 gap-5">
            {fly.map(function(v, i) {
              return (
                <div key={v.num} className="bg-[#0c0c12] border border-white/5 rounded-xl p-7 transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04] relative">
                  <span className="text-[2.8rem] font-extrabold text-emerald-400 block mb-5 leading-none tracking-tight">{v.num}</span>
                  <h4 className="font-bold text-white text-base mb-3">{v.title}</h4>
                  <p className="text-sm text-[#64748b] leading-relaxed">{v.desc}</p>
                  {i < 3 && <div className="hidden xl:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-lg select-none font-light">{'\u2192'}</div>}
                </div>
              );
            })}
          </div>
          <div className="md:hidden space-y-3">
            {fly.map(function(v) {
              return (
                <div key={v.num} className="bg-[#0c0c12] border border-white/5 rounded-xl p-5 flex gap-4 items-start">
                  <span className="text-[1.8rem] font-extrabold text-emerald-400 leading-none shrink-0">{v.num}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{v.title}</h4>
                    <p className="text-xs text-[#64748b] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── EXCLUSIVE TERRITORY ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-4">Exclusive By Design</h2>
              <h3 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(1.5rem,3vw,2.2rem)] text-white mb-6 leading-tight">One contractor per trade. Per metro area.</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">No shared leads. No bidding wars. No racing to answer while you\u2019re on a job site.</p>
              <p className="text-sm text-[#64748b] leading-relaxed">We lock in one HVAC company, one plumber, one roofer per territory. When demand hits, that contractor gets the lead \u2014 booked and confirmed \u2014 before anyone else even knows it exists. <strong className="text-white font-semibold">Your only job: show up and do the work.</strong></p>
            </div>
            <div className="space-y-4">
              {[
                { num: '100%', label: 'Exclusive leads \u2014 zero competition' },
                { num: '24/7', label: 'Autonomous lead capture \u2014 no missed calls' },
                { num: '1 human', label: 'Lock in partnerships, watch revenue stack' },
              ].map(function(v) {
                return (
                  <div key={v.label} className="bg-[#0c0c12] border border-white/5 border-l-[3px] border-l-emerald-500/60 rounded-xl p-6 transition-all duration-300 hover:-translate-y-[2px] hover:border-l-emerald-500 hover:shadow-lg hover:shadow-emerald-500/[0.03]">
                    <span className="text-[clamp(1.6rem,2.5vw,2.2rem)] font-extrabold text-emerald-400 block leading-none tracking-tight">{v.num}</span>
                    <span className="text-xs text-[#94a3b8] font-medium uppercase tracking-[0.08em] mt-2 block">{v.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="relative py-28 px-6 border-y border-white/5 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-48 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-4 text-center">Simple. Results-Based.</h2>
          <h3 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(1.6rem,3.5vw,2.6rem)] text-white text-center mb-14 leading-tight">Choose your partnership model</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Retainer — left */}
            <div className="bg-[#0c0c12] border border-white/5 rounded-xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04]">
              <div className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-5">Retainer</div>
              <div className="mb-10">
                <span className="text-[clamp(1.6rem,2.5vw,2.2rem)] font-extrabold text-white tracking-tight">Custom</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">per territory</span>
              </div>
              <ul className="space-y-3 flex-1">
                {p2.map(function(f) { return <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5"><span className="text-emerald-400 mt-0.5 shrink-0 font-bold">{'\u2713'}</span>{f}</li>; })}
              </ul>
              <a href="#contact" className="mt-8 w-full text-center border border-white/10 hover:border-emerald-500/25 text-[#94a3b8] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 hover:scale-[1.01]">Talk to Us</a>
            </div>

            {/* Per Booked Job — CENTER, FEATURED */}
            <div className="bg-[#0c0c12] border-2 border-emerald-500/40 rounded-xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/15 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[9px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-md shadow-lg shadow-emerald-500/30">Most Popular</div>
              <div className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-5 pt-1">Per Booked Job</div>
              <div className="mb-10">
                <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-white tracking-tight">15%</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">per completed appointment</span>
              </div>
              <ul className="space-y-3 flex-1">
                {p1.map(function(f) { return <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5"><span className="text-emerald-400 mt-0.5 shrink-0 font-bold">{'\u2713'}</span>{f}</li>; })}
              </ul>
              <a href="#get-started" className="relative overflow-hidden mt-8 w-full text-center bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/30 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">Get Started</a>
            </div>

            {/* Hybrid — right */}
            <div className="bg-[#0c0c12] border border-white/5 rounded-xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-[3px] hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/[0.04]">
              <div className="font-sans font-extrabold tracking-[0.15em] uppercase text-[10px] text-emerald-400 mb-5">Hybrid</div>
              <div className="mb-10">
                <span className="text-[clamp(0.9rem,1.8vw,1.4rem)] font-extrabold text-white tracking-tight">Retainer + 10%</span>
                <span className="text-sm text-[#64748b] block mt-1 font-normal">booking fee on top</span>
              </div>
              <ul className="space-y-3 flex-1">
                {p3.map(function(f) { return <li key={f} className="text-sm text-[#94a3b8] flex items-start gap-2.5"><span className="text-emerald-400 mt-0.5 shrink-0 font-bold">{'\u2713'}</span>{f}</li>; })}
              </ul>
              <a href="#contact" className="mt-8 w-full text-center border border-white/10 hover:border-emerald-500/25 text-[#94a3b8] hover:text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 hover:scale-[1.01]">Get Started</a>
            </div>
          </div>
          <p className="text-xs text-[#64748b] text-center mt-8 max-w-lg mx-auto">All plans include territory exclusivity, autonomous intake agents, and full booking integration. No hidden fees.</p>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="max-w-[620px] mx-auto relative z-10">
          <h2 className="font-sans font-extrabold tracking-tight uppercase text-[clamp(2rem,4vw,3rem)] text-white leading-tight mb-7">Stop renting leads. Start owning demand.</h2>
          <p className="text-sm text-[#94a3b8] leading-relaxed mb-5">The local trade market is broken. Contractors pay thousands per month for leads their competitors also bought, never see, or can\u2019t convert. <strong className="text-white font-semibold">JobSure fixes that \u2014 permanently.</strong></p>
          <p className="text-sm text-[#64748b] leading-relaxed mb-10">We run the entire lead machine. You run the business. And when a job is booked, you know exactly where it came from.</p>
          <a href="#pricing" className="relative overflow-hidden inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-9 py-3.5 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/25 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">Become a Partner</a>
          <p className="text-xs text-[#64748b] mt-5">Already a partner? <a href="/login" className="text-emerald-400/80 hover:text-emerald-400 transition-colors duration-300 font-medium">Sign in</a></p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-sans font-extrabold tracking-tight uppercase text-sm"><span className="text-emerald-400">Job</span><span className="text-white/60">Sure</span></span>
            <span className="text-[9px] text-[#64748b] uppercase tracking-[0.15em] font-semibold hidden sm:block">Ghost-managed lead generation for local trade contractors</span>
          </div>
          <span className="text-[10px] text-[#475569]">{'\u00A9'} {new Date().getFullYear()} JobSure. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
