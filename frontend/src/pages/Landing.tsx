export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-5xl font-bold mb-4">JobSure</h1>
          <p className="text-xl text-slate-400 mb-2">The Ghost-Managed Trade Lead Generation Network</p>
          <p className="text-slate-500 max-w-xl mx-auto">
            We don't build software for plumbers. We build the client-generation network <em>above</em> them.
            Pay-per-booked-appointment. Exclusive partnerships. Zero overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-emerald-400 mb-2">For Trade Contractors</h3>
            <p className="text-sm text-slate-400">Qualified, pre-booked appointments. No junk leads. No bidding wars. You show up and work — we handle the rest.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-emerald-400 mb-2">AI-Managed Intake</h3>
            <p className="text-sm text-slate-400">Sensing agents monitor local demand. Marketing spins up landing pages. Intake qualifies and books. Review agent chases ratings.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-emerald-400 mb-2">Pay-Per-Booking</h3>
            <p className="text-sm text-slate-400">No monthly minimums. No junk lead fees. You only pay when a confirmed appointment is booked and completed.</p>
          </div>
        </div>

        <div className="text-center">
          <a href="/login" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors">
            Partner Login
          </a>
          <p className="text-xs text-slate-600 mt-4">For existing partners. New partners: contact us.</p>
        </div>
      </div>
    </div>
  );
}
