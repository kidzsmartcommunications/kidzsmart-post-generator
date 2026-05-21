"use client";

import React, { useState } from "react";
import InputForm from "./components/InputForm";
import LoadingState from "./components/LoadingState";
import PostOutput from "./components/PostOutput";
import { FormInputs, ResearchData, GeneratedPosts } from "@/lib/types";

export default function Home() {
  const [posts, setPosts] = useState<GeneratedPosts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentBrand, setCurrentBrand] = useState("");
  const [currentContentType, setCurrentContentType] = useState("");

  const handleGeneratePosts = async (inputs: FormInputs) => {
    setLoading(true);
    setError("");
    setPosts(null);

    try {
      const researchResponse = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: inputs.brandName,
          eventSubject: inputs.eventSubject,
          sampleCopy: inputs.sampleCopy,
          additionalNotes: inputs.additionalNotes,
        }),
      });

      if (!researchResponse.ok) {
        throw new Error(`Research failed: ${researchResponse.statusText}`);
      }

      const researchData: ResearchData = await researchResponse.json();

      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: inputs.brandName,
          eventSubject: inputs.eventSubject,
          sampleCopy: inputs.sampleCopy,
          primaryChannel: inputs.primaryChannel,
          contentType: inputs.contentType || "Social Post",
          tone: inputs.tone,
          hashtags: inputs.hashtags,
          additionalNotes: inputs.additionalNotes,
          researchSummary: researchData.research_summary,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error(`Generation failed: ${generateResponse.statusText}`);
      }

      const generatedPosts: GeneratedPosts = await generateResponse.json();
      setPosts(generatedPosts);
      setCurrentBrand(inputs.brandName);
      setCurrentContentType(inputs.contentType || "Social Post");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="header">
        <div className="header-content">
          <h1>Kidzsmart Content Generator</h1>
          <p>Generate authentic, strategic content for kids & family brands</p>
        </div>
      </header>

      <main className="main-container">
        <div className="content-wrapper">
          <InputForm onSubmit={handleGeneratePosts} isLoading={loading} />

          {loading && <LoadingState />}

          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {posts && (
            <PostOutput
              variations={posts.variations}
              brand={currentBrand}
              contentType={currentContentType}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <p>📧 <a href="mailto:media@kidzsmart.com">media@kidzsmart.com</a></p>
      </footer>
    </div>
  );
}
