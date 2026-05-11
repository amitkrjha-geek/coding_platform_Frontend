import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Terminal, ShieldCheck, Code2, Zap } from 'lucide-react'
import GridBackground from '@/components/shared/GridBackground'
import TerminalEyebrow from '@/components/shared/TerminalEyebrow'

const highlights = [
  {
    icon: Terminal,
    title: 'Real-world labs',
    description: 'Hands-on offensive engineering challenges sourced from real engagements.',
  },
  {
    icon: Code2,
    title: 'Multi-language IDE',
    description: 'Compile, run, and submit C, C++, and C# directly in the browser.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure sandbox',
    description: 'Every run executes inside an isolated agent — your machine stays clean.',
  },
  {
    icon: Zap,
    title: 'Live agent telemetry',
    description: 'Stream stdout, stderr, and exploit results in real time over a websocket.',
  },
]

export default function Page() {
  return (
    <div className="relative min-h-screen w-full flex items-stretch bg-htb-bg overflow-hidden pt-16">
      <GridBackground variant="neon" />

      <div className="relative z-10 w-full grid lg:grid-cols-2">
        {/* Left — Branding panel */}
        <aside className="hidden lg:flex flex-col justify-between p-10 xl:p-14 border-r border-htb-border">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="relative flex items-center justify-center w-9 h-9 rounded border border-neon/30 bg-neon/5 group-hover:border-neon group-hover:bg-neon/10 transition-colors">
                <Terminal className="w-5 h-5 text-neon" />
              </span>
              <span className="text-xl font-bold tracking-tight text-htb-text">
                Vio<span className="text-neon">_</span>ethat
              </span>
            </Link>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <TerminalEyebrow cursor>auth.required</TerminalEyebrow>
              <h2 className="heading-display text-3xl xl:text-4xl text-htb-text">
                Welcome back, <span className="text-neon">operator</span>.
              </h2>
              <p className="text-htb-muted text-sm xl:text-base max-w-md leading-relaxed">
                Authenticate to resume your training, review past submissions,
                and continue capturing flags across the arsenal.
              </p>
            </div>

            <ul className="space-y-4 max-w-md">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md border border-neon/30 bg-neon/10 text-neon">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-htb-text text-sm">
                      {item.title}
                    </div>
                    <div className="text-htb-muted text-xs leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
            <span className="block w-1.5 h-1.5 rounded-full bg-neon animate-glow-pulse" />
            All systems operational
          </div>
        </aside>

        {/* Right — Sign-in widget */}
        <main className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14">
          {/* Mobile-only mini header */}
          <div className="lg:hidden mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative flex items-center justify-center w-9 h-9 rounded border border-neon/30 bg-neon/5">
                <Terminal className="w-5 h-5 text-neon" />
              </span>
              <span className="text-xl font-bold tracking-tight text-htb-text">
                Vio<span className="text-neon">_</span>ethat
              </span>
            </Link>
          </div>

          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'mx-auto',
                  card: 'panel shadow-panel-lg !bg-htb-panel border border-htb-border',
                  headerTitle: 'text-htb-text font-bold tracking-tight',
                  headerSubtitle: 'text-htb-muted',
                  socialButtonsBlockButton:
                    'border border-htb-border bg-htb-bg hover:border-neon/40 hover:bg-neon/5 text-htb-text transition-colors',
                  socialButtonsBlockButtonText: 'text-htb-text font-medium',
                  dividerLine: 'bg-htb-border',
                  dividerText: 'text-htb-text-dim font-mono uppercase tracking-widest text-[10px]',
                  formFieldLabel: 'text-htb-muted font-mono uppercase tracking-widest text-[11px]',
                  formFieldInput:
                    'bg-htb-bg border border-htb-border text-htb-text hover:border-htb-border-hover focus:border-neon/60 focus:ring-1 focus:ring-neon/40 transition-colors',
                  formButtonPrimary:
                    'bg-neon text-htb-bg hover:bg-neon-green-dim hover:shadow-neon-sm font-mono text-xs uppercase tracking-widest font-semibold transition-all',
                  footer: 'bg-transparent',
                  footerActionText: 'text-htb-muted',
                  footerActionLink:
                    'text-neon hover:text-neon-green-dim font-semibold transition-colors',
                  identityPreviewText: 'text-htb-text',
                  identityPreviewEditButton: 'text-neon hover:text-neon-green-dim',
                  formFieldErrorText: 'text-danger',
                  alertText: 'text-htb-muted',
                  formResendCodeLink: 'text-neon hover:text-neon-green-dim',
                  otpCodeFieldInput:
                    'bg-htb-bg border border-htb-border text-htb-text focus:border-neon/60',
                },
              }}
            />
          </div>

          <p className="mt-6 text-center text-[11px] font-mono uppercase tracking-widest text-htb-text-dim">
            Need an account?{' '}
            <Link
              href="/sign-up"
              className="text-neon hover:text-neon-green-dim font-semibold transition-colors"
            >
              Register here
            </Link>
          </p>
        </main>
      </div>
    </div>
  )
}
