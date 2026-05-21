"use client";

import React, { useState } from "react";

interface RefinementModalProps {
  originalPost: string;
  onClose: () => void;
  brand: string;
  contentType: string;
}

export default function RefinementModal({
  originalPost,
  onClose,
  brand,
  contentType,
}: RefinementModalProps) {
  const [refinementNotes, setRefinementNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [refinedPost, setRefinedPost] = useState<string | null>(null);

  const handleRefine = async () => {
    if (!refinementNotes.trim()) {
      alert("Please enter refinement notes");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPost,
          additionalNotes: refinementNotes,
          platform: "multi",
          brand,
          contentType,
        }),
      });

      if (!response.ok) throw new Error("Refinement failed");
      const data = await response.json();
      setRefinedPost(data.refined_copy);
    } catch (error) {
      alert("Refinement failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Refine Content</h3>

        <div className="modal-section">
          <label>Original Content</label>
          <div className="modal-text">{originalPost}</div>
        </div>

        <div className="modal-section">
          <label>Refinement Notes</label>
          <textarea
            value={refinementNotes}
            onChange={(e) => setRefinementNotes(e.target.value)}
            placeholder="What would you like to change? (e.g., make it more playful, add data, shorten it)"
            rows={4}
          />
        </div>

        {refinedPost && (
          <div className="modal-section">
            <label>Refined Content</label>
            <div className="modal-text">{refinedPost}</div>
            <button
              className="btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(refinedPost);
                alert("Copied to clipboard!");
              }}
            >
              Copy Refined
            </button>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Close
          </button>
          <button
            className="submit-btn"
            onClick={handleRefine}
            disabled={loading}
          >
            {loading ? "Refining..." : "Refine"}
          </button>
        </div>
      </div>
    </div>
  );
}
