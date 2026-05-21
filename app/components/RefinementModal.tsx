// app/components/RefinementModal.tsx

"use client";

import { PostVariation } from "@/lib/types";
import { useState } from "react";

interface RefinementModalProps {
  post: PostVariation;
  platform: string;
  brand: string;
  tone: string;
  onClose: () => void;
}

export default function RefinementModal({
  post,
  platform,
  brand,
  tone,
  onClose,
}: RefinementModalProps) {
  const [refinementNotes, setRefinementNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refinedPost, setRefinedPost] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState<string | null>(null);

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementNotes.trim()) {
      alert("Please add some refinement notes");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPost: post.post_copy,
          additionalNotes: refinementNotes,
          platform,
          brand,
          tone,
        }),
      });

      const data = await response.json();
      setRefinedPost(data.refined_copy);
      setChangesMade(data.changes_made);
    } catch (error) {
      alert("Failed to refine post. Try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3>Refine Your Post</h3>

        {!refinedPost ? (
          <form onSubmit={handleRefine}>
            <div className="form-group">
              <label>Original Post</label>
              <p className="post-preview">{post.post_copy}</p>
            </div>

            <div className="form-group">
              <label htmlFor="refinement-notes">
                What would you like to adjust?
              </label>
              <textarea
                id="refinement-notes"
                value={refinementNotes}
                onChange={(e) => setRefinementNotes(e.target.value)}
                placeholder="e.g., 'Make it more playful' or 'Add this specific metric' or 'Less formal tone'"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="modal-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Refining..." : "Refine Post"}
              </button>
              <button type="button" onClick={onClose} disabled={isLoading}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="refinement-result">
            <div className="form-group">
              <label>Refined Post</label>
              <p className="post-preview">{refinedPost}</p>
            </div>

            {changesMade && (
              <div className="form-group">
                <label>Changes Made</label>
                <p className="changes-text">{changesMade}</p>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn-copy"
                onClick={() => copyToClipboard(refinedPost)}
              >
                📋 Copy Refined Post
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setRefinedPost(null);
                  setChangesMade(null);
                  setRefinementNotes("");
                }}
              >
                Refine Again
              </button>
              <button type="button" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
