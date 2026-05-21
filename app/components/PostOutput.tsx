"use client";

import React, { useState } from "react";
import { PostVariation } from "@/lib/types";
import RefinementModal from "./RefinementModal";

interface PostOutputProps {
  variations: PostVariation[];
  brand: string;
  contentType: string;
}

export default function PostOutput({ variations, brand, contentType }: PostOutputProps) {
  const [selectedPost, setSelectedPost] = useState<PostVariation | null>(null);
  const [showRefinement, setShowRefinement] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="output-container">
      <h3>Generated {contentType}s for {brand}</h3>

      {variations.map((variation) => (
        <div key={variation.position} className="post-card">
          {/* Header */}
          <div className="post-header">
            <h4>Variation {variation.position}</h4>
          </div>

          {/* Post Copy - Main Content */}
          <div className="post-section post-copy-section">
            <h5>Content</h5>
            <div className="post-copy">
              {variation.post_copy}
            </div>
          </div>

          {/* Metadata Row - 2 columns */}
          <div className="post-metadata-row">
            <div className="post-section post-detail">
              <strong>Hook Strategy</strong>
              <p>{variation.hook_used}</p>
            </div>
            <div className="post-section post-detail">
              <strong>Why It Works</strong>
              <p>{variation.why_it_works}</p>
            </div>
          </div>

          {/* Platform Notes */}
          <div className="post-section post-detail">
            <strong>Platform Notes</strong>
            <p>{variation.platform_notes}</p>
          </div>

          {/* Kidzsmart Angle */}
          {variation.kidzsmart_angle && (
            <div className="post-section kidzsmart-angle">
              <strong>🎯 Kidzsmart Angle</strong>
              <p>{variation.kidzsmart_angle}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="post-actions">
            <button
              className="btn-secondary"
              onClick={() => handleCopyToClipboard(variation.post_copy)}
            >
              Copy Content
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setSelectedPost(variation);
                setShowRefinement(true);
              }}
            >
              Refine
            </button>
          </div>
        </div>
      ))}

      {/* Refinement Modal */}
      {showRefinement && selectedPost && (
        <RefinementModal
          originalPost={selectedPost.post_copy}
          onClose={() => setShowRefinement(false)}
          brand={brand}
          contentType={contentType}
        />
      )}
    </div>
  );
}
