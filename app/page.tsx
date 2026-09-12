import Link from 'next/link'

const SPECS = [
  { n: '01', t: 'Tasks, flat', d: 'Due dates and priorities in one list. No boards, no tags maze.' },
  { n: '02', t: 'Attendance vs 75%', d: 'Every subject measured against the only line that matters — with bunk budget.' },
  { n: '03', t: 'One timeline', d: 'Tasks and events merged, oldest first. Check it once in the morning.' },
]

export default function LandingPage() {
  return (
    <div className="bg-black min-h-dvh">
      <div className="nos-wrap">
        {/* nav */}
        <nav className="flex items-center justify-between py-6 border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-[#E5342B] rounded-full" />
            <span className="text-[16px] font-semibold tracking-wide">BREEZY</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] mr-2">
              <div className="nos-pulse" />
              SYSTEM ONLINE
            </div>
            <Link href="/login" className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] px-4 py-2.5 border border-[rgba(255,255,255,0.22)] hover:bg-[#151515] transition-colors">
              SIGN IN
            </Link>
            <Link href="/signup" className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] px-4 py-2.5 bg-[#E5342B] border border-[#E5342B] text-black hover:bg-[#ff473d] transition-colors">
              GET STARTED
            </Link>
          </div>
        </nav>

        {/* hero — spec-sheet style, huge dot-matrix number */}
        <div className="py-16 md:py-24 border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] mb-6">
            /// STUDENT OS — V0.1
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl">
            Your semester,<br />
            read in <span className="font-[family-name:var(--font-dot-gothic)] font-normal text-[#E5342B]">15 sec</span>.
          </h1>
          <p className="mt-6 text-[15px] text-[#7A7A7A] max-w-md leading-relaxed">
            Attendance against the 75% line, tasks due now, and today&apos;s timeline.
            One black page. No streaks, no AI clutter.
          </p>
          <div className="flex gap-3 mt-8">
            <Link href="/signup" className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] px-6 py-3.5 bg-[#E5342B] border border-[#E5342B] text-black hover:bg-[#ff473d] transition-colors">
              START →
            </Link>
            <Link href="/login" className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] px-6 py-3.5 border border-[rgba(255,255,255,0.22)] hover:bg-[#151515] transition-colors">
              SIGN IN
            </Link>
          </div>

          {/* raw terminal preview */}
          <div className="mt-12 border border-[rgba(255,255,255,0.22)] bg-[#0D0D0D] max-w-2xl">
            <div className="flex justify-between px-4 py-2.5 border-b border-dashed border-[rgba(255,255,255,0.14)] font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
              <span>BREEZY — PREVIEW</span>
              <span>LIVE</span>
            </div>
            <div className="px-4 py-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] leading-loose">
              <div className="flex justify-between"><span className="text-[#7A7A7A]">ATTENDANCE</span><span>76% <span className="text-[#E5342B]">AT RISK</span></span></div>
              <div className="flex justify-between border-t border-dashed border-[rgba(255,255,255,0.08)]"><span className="text-[#7A7A7A]">DUE TODAY</span><span>3 TASKS</span></div>
              <div className="flex justify-between border-t border-dashed border-[rgba(255,255,255,0.08)]"><span className="text-[#7A7A7A]">NEXT</span><span>OS LECTURE · 2:00 PM</span></div>
            </div>
          </div>
        </div>

        {/* specs */}
        <div className="grid md:grid-cols-3 border-b border-dashed border-[rgba(255,255,255,0.14)]">
          {SPECS.map(s => (
            <div key={s.n} className="px-1 py-8 md:px-6 md:border-r border-b md:border-b-0 border-dashed border-[rgba(255,255,255,0.14)] last:border-r-0 last:border-b-0">
              <div className="font-[family-name:var(--font-dot-gothic)] text-[#454545] text-[13px] mb-3">{s.n}</div>
              <div className="text-[16px] font-semibold mb-2">{s.t}</div>
              <div className="text-[13px] text-[#7A7A7A] max-w-[280px]">{s.d}</div>
            </div>
          ))}
        </div>

        <footer className="py-7 flex justify-between items-center font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
          <div>BREEZY / BUILT FOR SRM</div>
          <div>V0.1</div>
        </footer>
      </div>
    </div>
  )
}
