"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MicCheck from "./MicCheck";
import { createInterview } from "@/lib/actions/general.action";

/* ── Static data ── */
const TRACKS = [
  { id: "tech",       label: "Tech",       icon: "code" },
  { id: "finance",    label: "Finance",    icon: "account_balance" },
  { id: "marketing",  label: "Marketing",  icon: "campaign" },
  { id: "healthcare", label: "Healthcare", icon: "medical_services" },
];

const TYPES = [
  { id: "Behavioral", label: "Behavioral",  icon: "psychology",  desc: "Past experiences and soft skills." },
  { id: "Technical",  label: "Technical",   icon: "terminal",    desc: "Coding, systems, and domain knowledge." },
  { id: "Mixed",      label: "Case Study",  icon: "lightbulb",   desc: "Problem solving and logical frameworks." },
];

const COACHES = [
  {
    id: "sarah",
    name: "Sarah",
    badge: "Encouraging",
    badgeClass: "badge-teal",
    desc: "Ideal for beginners. Sarah provides constructive feedback and gentle guidance throughout.",
    avatar: "👩‍💼",
  },
  {
    id: "david",
    name: "David",
    badge: "Challenging",
    badgeClass: "badge-red",
    desc: "For high-stakes prep. David uses a direct, rapid-fire style common in elite firm interviews.",
    avatar: "👨‍💼",
  },
  {
    id: "maya",
    name: "Maya",
    badge: "Professional",
    badgeClass: "badge-slate",
    desc: "The standard experience. Maya maintains a formal, objective, and realistic corporate tone.",
    avatar: "👩‍🏫",
  },
];

const LEVELS  = ["Junior", "Mid", "Senior"];
const AMOUNTS = [3, 5, 8, 10];

export default function PracticeLobby() {
  const router = useRouter();

  const [track,  setTrack]  = useState("tech");
  const [type,   setType]   = useState("Technical");
  const [coach,  setCoach]  = useState("maya");
  const [role,   setRole]   = useState("");
  const [level,  setLevel]  = useState("Junior");
  const [tech,   setTech]   = useState("");
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);

  const selectedCoach = COACHES.find((c) => c.id === coach)!;
  const selectedType  = TYPES.find((t)  => t.id === type)!;
  const selectedTrack = TRACKS.find((t) => t.id === track)!;

  const handleStart = async () => {
    if (!role.trim()) { toast.error("Please enter the job role."); return; }
    if (!tech.trim()) { toast.error("Please enter the tech stack."); return; }

    setLoading(true);
    const result = await createInterview({ role, level, type, techstack: tech, amount, coach, track });
    if (result.success && result.interviewId) {
      router.push(`/interview/${result.interviewId}`);
    } else {
      toast.error(result.error ?? "Failed to generate interview.");
      setLoading(false);
    }
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-headline-lg text-on-surface">Interview Practice Lobby</h1>
        <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Configure your session to match your upcoming interview. Our AI will adjust its
          persona and question set based on your selections.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* Step 1 — Track */}
        <section>
          <StepHeader n={1} title="Select Your Track" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrack(t.id)}
                className={`selection-card p-6 flex flex-col items-center gap-3 group ${
                  track === t.id ? "active" : ""
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[40px] transition-transform group-hover:scale-110 ${
                    track === t.id ? "text-secondary" : "text-on-surface-variant"
                  }`}
                >
                  {t.icon}
                </span>
                <span className="text-label-md font-bold text-on-surface">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 — Type */}
        <section>
          <StepHeader n={2} title="Choose Interview Type" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`selection-card p-4 flex items-start gap-4 text-left ${
                  type === t.id ? "active" : ""
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    type === t.id
                      ? "bg-secondary-container"
                      : "bg-surface-container"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      type === t.id ? "text-on-secondary-container" : "text-on-surface-variant"
                    }`}
                  >
                    {t.icon}
                  </span>
                </div>
                <div>
                  <p className="text-body-md font-bold text-on-surface">{t.label}</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3 — Coach */}
        <section>
          <StepHeader n={3} title="Select Your AI Coach" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COACHES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCoach(c.id)}
                className={`selection-card overflow-hidden flex flex-col text-left ${
                  coach === c.id ? "active" : ""
                }`}
              >
                {/* Avatar placeholder */}
                <div
                  className="w-full h-40 flex items-center justify-center text-6xl"
                  style={{
                    background:
                      c.id === "sarah"
                        ? "linear-gradient(135deg, #86f2e4 0%, #d3e4fe 100%)"
                        : c.id === "david"
                        ? "linear-gradient(135deg, #e4e2e4 0%, #c6c6cd 100%)"
                        : "linear-gradient(135deg, #dae2fd 0%, #86f2e4 100%)",
                  }}
                >
                  {c.avatar}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-body-md font-bold text-on-surface">{c.name}</p>
                    <span className={c.badgeClass}>{c.badge}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4 — Details */}
        <section>
          <StepHeader n={4} title="Interview Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="input-label">Job Role *</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Tech Stack (comma-separated) *</label>
              <input
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js"
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Experience Level</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-body-sm transition-all ${
                      level === l
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-outline-variant text-on-surface-variant hover:border-secondary/50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="input-label">Number of Questions</label>
              <div className="flex gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`flex-1 py-2.5 rounded-lg border-2 font-semibold text-body-sm transition-all ${
                      amount === a
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-outline-variant text-on-surface-variant hover:border-secondary/50"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mic check */}
        <MicCheck />
      </div>

      {/* ── Sticky footer CTA ── */}
      <footer className="fixed bottom-0 left-0 w-full bg-surface-container-highest/95 glass border-t border-outline-variant z-40">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-24 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
              Ready to practice?
            </p>
            <div className="flex gap-2 mt-1">
              <span className="text-body-md font-bold text-secondary">{selectedTrack.label}</span>
              <span className="text-outline-variant">•</span>
              <span className="text-body-md font-bold text-secondary">{selectedType.label}</span>
              <span className="text-outline-variant">•</span>
              <span className="text-body-md font-bold text-secondary">{selectedCoach.name}</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Generating…
              </>
            ) : (
              <>
                Join Interview Room
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-md font-bold flex-shrink-0">
        {n}
      </div>
      <h2 className="text-headline-md text-on-surface">{title}</h2>
    </div>
  );
}
