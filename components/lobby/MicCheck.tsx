"use client";

import { useState, useEffect, useRef } from "react";

export default function MicCheck() {
  const [micName, setMicName] = useState("Default Microphone");
  const [testing, setTesting] = useState(false);
  const [level, setLevel] = useState(0);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        const mic = devices.find((d) => d.kind === "audioinput");
        if (mic?.label) setMicName(mic.label.split("(")[0].trim());
      })
      .catch(() => {});
    return () => stopTest();
  }, []);

  const stopTest = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    setTesting(false);
    setLevel(0);
  };

  const startTest = async () => {
    if (testing) { stopTest(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setTesting(true);

      const tick = () => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setLevel(Math.min(100, avg * 2));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      setTimeout(stopTest, 5000);
    } catch {
      setTesting(false);
    }
  };

  const bars = [20, 40, 30, 50, 35, 45, 25, 55, 40, 30];

  return (
    <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
            settings_voice
          </span>
        </div>
        <div>
          <p className="text-label-md font-semibold text-on-surface">Hardware Check</p>
          <p className="text-label-sm text-on-surface-variant">{micName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Level bars */}
        <div className="flex gap-0.5 h-6 items-end">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-100"
              style={{
                height: testing ? `${Math.max(4, (level / 100) * h)}px` : "4px",
                backgroundColor: testing ? "#006a61" : "#c6c6cd",
                transitionDelay: `${i * 30}ms`,
              }}
            />
          ))}
        </div>

        <button
          onClick={startTest}
          className={`px-4 py-1.5 rounded-lg border font-semibold text-label-md transition-colors ${
            testing
              ? "border-error text-error hover:bg-error/5"
              : "border-secondary text-secondary hover:bg-secondary/5"
          }`}
        >
          {testing ? "Stop" : "Test Mic"}
        </button>
      </div>
    </div>
  );
}
