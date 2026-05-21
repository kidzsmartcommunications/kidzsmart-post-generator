// app/components/LoadingState.tsx

"use client";

export default function LoadingState({ stage }: { stage: string }) {
  const messages = {
    research: "🔍 Researching brand...",
    generate: "✨ Creating posts in Kidzsmart voice...",
    complete: "✅ Posts ready!",
  };

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{messages[stage as keyof typeof messages] || "Loading..."}</p>
      <p className="loading-subtitle">This usually takes 30-60 seconds</p>
    </div>
  );
}
