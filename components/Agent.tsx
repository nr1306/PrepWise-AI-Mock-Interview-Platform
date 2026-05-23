"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { vapi } from "@/lib/vapi.sdk";
import { coaches, interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import WaveformVisualizer from "@/components/interview/WaveformVisualizer";
import SessionTimer from "@/components/interview/SessionTimer";

enum CallStatus {
  INACTIVE   = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE     = "ACTIVE",
  FINISHED   = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "literally"];

function computeConfidence(messages: SavedMessage[]): number {
  const userMsgs = messages.filter((m) => m.role === "user");
  if (!userMsgs.length) return 0;
  const words = userMsgs.map((m) => m.content.toLowerCase().split(/\s+/)).flat();
  const fillerCount = words.filter((w) => FILLER_WORDS.includes(w)).length;
  const ratio = fillerCount / Math.max(words.length, 1);
  return Math.round(Math.max(40, Math.min(99, 100 - ratio * 300)));
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  coach = "maya",
}: AgentProps & { coach?: string }) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages,   setMessages]   = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  const confidence = useMemo(() => computeConfidence(messages), [messages]);

  useEffect(() => {
    const onCallStart  = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd    = () => setCallStatus(CallStatus.FINISHED);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd   = () => setIsSpeaking(false);
    const onError = (e: any) => {
      const msg = e?.error?.message?.msg ?? e?.message ?? "";
      if (msg === "Meeting has ended") return; // normal call end, not a real error
      console.error("Vapi error:", e);
    };

    const onMessage = (msg: Message) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setMessages((prev) => [...prev, { role: msg.role, content: msg.transcript }]);
      }
    };

    vapi.on("call-start",   onCallStart);
    vapi.on("call-end",     onCallEnd);
    vapi.on("message",      onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end",   onSpeechEnd);
    vapi.on("error",        onError);

    return () => {
      vapi.off("call-start",   onCallStart);
      vapi.off("call-end",     onCallEnd);
      vapi.off("message",      onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end",   onSpeechEnd);
      vapi.off("error",        onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (msgs: SavedMessage[]) => {
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: msgs,
        feedbackId,
      });
      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: { username: userName, userid: userId },
        });
      } else {
        const config = coaches[coach] ?? interviewer;
        const formattedQuestions = questions
          ? questions.map((q) => `- ${q}`).join("\n")
          : "";
        await vapi.start(config, {
          variableValues: { questions: formattedQuestions },
        });
      }
    } catch (error) {
      console.error("Vapi start failed:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const isActive     = callStatus === CallStatus.ACTIVE;
  const isConnecting = callStatus === CallStatus.CONNECTING;
  const isFinished   = callStatus === CallStatus.FINISHED;

  const coachInfo = {
    sarah: { name: "Sarah",  emoji: "👩‍💼", badge: "Encouraging" },
    david: { name: "David",  emoji: "👨‍💼", badge: "Challenging" },
    maya:  { name: "Maya",   emoji: "👩‍🏫", badge: "Professional" },
  }[coach] ?? { name: "AI Coach", emoji: "🤖", badge: "Professional" };

  return (
    <div className="flex flex-col gap-6 min-h-[60vh]">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isActive ? "bg-secondary animate-pulse" : "bg-outline-variant"
            }`}
          />
          <span className="text-label-md text-on-surface-variant">
            {isActive
              ? isSpeaking
                ? "AI is speaking…"
                : "AI is listening…"
              : isConnecting
              ? "Connecting…"
              : isFinished
              ? "Processing feedback…"
              : "Ready to start"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isActive && messages.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10">
              <span className="material-symbols-outlined text-secondary text-[14px]">
                psychology
              </span>
              <span className="text-label-sm text-secondary font-bold">
                {confidence}% Confidence
              </span>
            </div>
          )}
          <SessionTimer running={isActive} />
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI Coach */}
        <div className="card p-8 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center text-5xl">
            {coachInfo.emoji}
          </div>
          <div className="text-center">
            <p className="text-body-md font-bold text-on-surface">{coachInfo.name}</p>
            <span className="badge badge-teal mt-1">{coachInfo.badge}</span>
          </div>
          <WaveformVisualizer isActive={isActive} isSpeaking={isSpeaking} />
        </div>

        {/* User */}
        <div className="card p-8 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center text-5xl">
            👤
          </div>
          <p className="text-body-md font-bold text-on-surface">{userName}</p>
          <WaveformVisualizer isActive={isActive} isSpeaking={!isSpeaking && isActive} />
        </div>
      </div>

      {/* ── Transcript ── */}
      <AnimatePresence mode="wait">
        {lastMessage && (
          <motion.div
            key={lastMessage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-4 text-center"
          >
            <p className="text-body-md text-on-surface italic">&ldquo;{lastMessage}&rdquo;</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls ── */}
      <div className="flex justify-center gap-4">
        {!isActive && !isFinished ? (
          <button
            onClick={handleCall}
            disabled={isConnecting}
            className="btn-primary px-8 py-3 disabled:opacity-60"
          >
            {isConnecting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Connecting…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">mic</span>
                Start Interview
              </>
            )}
          </button>
        ) : isActive ? (
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 bg-error text-on-error font-semibold
                       px-8 py-3 rounded-lg hover:bg-error/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">call_end</span>
            End Interview
          </button>
        ) : (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>
            Generating your feedback…
          </div>
        )}
      </div>
    </div>
  );
};

export default Agent;
