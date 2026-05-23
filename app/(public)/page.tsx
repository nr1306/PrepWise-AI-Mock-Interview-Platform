import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const SUCCESS_TAGS = [
  { label: "94% for Software Engineers",  color: "bg-secondary/10 text-secondary" },
  { label: "88% for Finance Analysts",    color: "bg-secondary/10 text-secondary" },
  { label: "91% for Product Managers",    color: "bg-secondary/10 text-secondary" },
  { label: "86% for Healthcare Roles",    color: "bg-secondary/10 text-secondary" },
  { label: "92% for Marketing Leaders",   color: "bg-secondary/10 text-secondary" },
];

const STEPS = [
  { icon: "tune",           title: "Choose Your Track",   desc: "Pick your industry, interview style, and AI coach persona." },
  { icon: "mic",            title: "Talk to AI",           desc: "Practice with a realistic voice AI that adapts to your answers." },
  { icon: "insights",       title: "Get Feedback",         desc: "Receive a detailed score breakdown and actionable improvements." },
];

const COACHES = [
  { emoji: "👩‍💼", name: "Sarah",  badge: "Encouraging",  desc: "Warm, patient, and constructive — ideal for beginners.",  badgeColor: "badge-teal" },
  { emoji: "👨‍💼", name: "David",  badge: "Challenging",   desc: "Direct and rapid-fire — for high-stakes prep.",            badgeColor: "badge-red" },
  { emoji: "👩‍🏫", name: "Maya",   badge: "Professional",  desc: "Formal, objective, and realistic — the standard experience.", badgeColor: "badge-slate" },
];

export default async function LandingPage() {
  const authed = await isAuthenticated();
  if (authed) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-background/80 glass border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl">waves</span>
          <span className="text-headline-md text-on-surface font-bold">PrepAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="btn-ghost text-body-sm no-underline">Sign In</Link>
          <Link href="/sign-up" className="btn-primary text-body-sm no-underline px-4 py-2">Get Started</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 pt-24 pb-20 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SUCCESS_TAGS.map((t) => (
            <span key={t.label} className={`badge ${t.color} text-label-sm`}>
              {t.label}
            </span>
          ))}
        </div>

        <h1 className="text-headline-xl text-on-surface max-w-3xl mx-auto mb-6">
          Ace Your Next Interview with{" "}
          <span className="text-secondary">AI Voice Practice</span>
        </h1>

        <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10">
          Practice with a realistic AI interviewer, get instant scored feedback, and track
          your improvement — all in your browser with no downloads required.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/sign-up" className="btn-primary no-underline text-body-md px-8 py-3">
            Start Practicing Free
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link href="/sign-in" className="btn-secondary no-underline text-body-md px-8 py-3">
            Sign In
          </Link>
        </div>
      </section>

      {/* ── 3-step flow ── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <h2 className="text-headline-lg text-on-surface text-center mb-12">
            Three steps to interview mastery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-5">
                  <span className="material-symbols-outlined text-on-secondary-container text-[28px]">
                    {step.icon}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-sm font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="text-headline-md text-on-surface mb-2">{step.title}</h3>
                <p className="text-body-md text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coach preview ── */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-20">
        <h2 className="text-headline-lg text-on-surface text-center mb-4">
          Choose your AI Coach
        </h2>
        <p className="text-body-lg text-on-surface-variant text-center mb-12 max-w-xl mx-auto">
          Each coach has a distinct personality and interview style — pick the one that
          matches your goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COACHES.map((c) => (
            <div key={c.name} className="card p-6 flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-4xl">
                {c.emoji}
              </div>
              <div>
                <p className="text-body-md font-bold text-on-surface">{c.name}</p>
                <span className={`${c.badgeColor} mt-1`}>{c.badge}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-primary-container py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-headline-lg text-inverse-on-surface mb-4">
            Ready to start?
          </h2>
          <p className="text-body-lg text-on-primary-container mb-8 max-w-md mx-auto">
            Join thousands of candidates who practice smarter with PrepAI.
          </p>
          <Link href="/sign-up" className="btn-primary no-underline text-body-md px-8 py-3 inline-flex">
            Get Started — It&apos;s Free
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-outline-variant py-8 text-center">
        <p className="text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} PrepAI. Built with Next.js + Vapi AI.
        </p>
      </footer>
    </div>
  );
}
