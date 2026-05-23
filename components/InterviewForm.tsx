"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInterview } from "@/lib/actions/general.action";

const LEVELS = ["Junior", "Mid", "Senior"];
const TYPES = ["Technical", "Behavioural", "Mixed"];

export default function InterviewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await createInterview({
      role: data.get("role") as string,
      level: data.get("level") as string,
      type: data.get("type") as string,
      techstack: data.get("techstack") as string,
      amount: Number(data.get("amount")),
    });

    if (result.success && result.interviewId) {
      router.push(`/interview/${result.interviewId}`);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg">
      <div className="form">
        <label className="label">Job Role</label>
        <input
          name="role"
          required
          placeholder="e.g. Frontend Developer"
          className="input w-full"
        />
      </div>

      <div className="form">
        <label className="label">Experience Level</label>
        <select name="level" required className="input w-full bg-dark-200">
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="form">
        <label className="label">Interview Type</label>
        <select name="type" required className="input w-full bg-dark-200">
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="form">
        <label className="label">Tech Stack (comma-separated)</label>
        <input
          name="techstack"
          required
          placeholder="e.g. React, TypeScript, Node.js"
          className="input w-full"
        />
      </div>

      <div className="form">
        <label className="label">Number of Questions</label>
        <input
          name="amount"
          type="number"
          required
          min={1}
          max={20}
          defaultValue={5}
          className="input w-full"
        />
      </div>

      {error && <p className="text-destructive-100 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full min-h-10">
        {loading ? "Generating interview…" : "Generate Interview"}
      </button>
    </form>
  );
}
