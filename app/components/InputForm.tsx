"use client";

import React, { useState } from "react";
import { FormInputs } from "@/lib/types";

interface InputFormProps {
  onSubmit: (inputs: FormInputs) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormInputs>({
    brandName: "",
    eventSubject: "",
    sampleCopy: "",
    primaryChannel: "LinkedIn",
    contentType: "Social Post",
    tone: "Authentic",
    hashtags: "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName.trim() || !formData.eventSubject.trim()) {
      alert("Please fill in brand name and event/subject");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Generate Kidzsmart Content</h2>

      {/* Brand Name */}
      <div className="form-group">
        <label htmlFor="brandName">Brand / Company Name *</label>
        <input
          type="text"
          id="brandName"
          name="brandName"
          value={formData.brandName}
          onChange={handleChange}
          placeholder="e.g., Major CPG brand, toy company, streaming platform"
          required
        />
      </div>

      {/* Event / Subject */}
      <div className="form-group">
        <label htmlFor="eventSubject">Event / Subject / Idea *</label>
        <input
          type="text"
          id="eventSubject"
          name="eventSubject"
          value={formData.eventSubject}
          onChange={handleChange}
          placeholder="e.g., Product launch, partnership announcement, seasonal campaign"
          required
        />
      </div>

      {/* Sample Copy */}
      <div className="form-group">
        <label htmlFor="sampleCopy">Sample Copy (optional)</label>
        <textarea
          id="sampleCopy"
          name="sampleCopy"
          value={formData.sampleCopy}
          onChange={handleChange}
          placeholder="Paste any existing copy, press release, or brand messaging..."
          rows={3}
        />
      </div>

      {/* Primary Channel */}
      <div className="form-group">
        <label htmlFor="primaryChannel">Primary Channel</label>
        <select
          id="primaryChannel"
          name="primaryChannel"
          value={formData.primaryChannel}
          onChange={handleChange}
        >
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="Twitter">Twitter / X</option>
          <option value="Multi">Multi-platform</option>
        </select>
      </div>

      {/* Content Type */}
      <div className="form-group">
        <label htmlFor="contentType">Content Type</label>
        <select
          id="contentType"
          name="contentType"
          value={formData.contentType}
          onChange={handleChange}
        >
          <option value="Social Post">Social Post</option>
          <option value="Email">Email Campaign</option>
          <option value="Blog Article">Blog Article</option>
          <option value="LinkedIn Article">LinkedIn Article</option>
        </select>
      </div>

      {/* Tone */}
      <div className="form-group">
        <label htmlFor="tone">Tone</label>
        <select
          id="tone"
          name="tone"
          value={formData.tone}
          onChange={handleChange}
        >
          <option value="Authentic">Authentic</option>
          <option value="Strategic">Strategic</option>
          <option value="Celebratory">Celebratory</option>
          <option value="Playful">Playful</option>
          <option value="Thought Leadership">Thought Leadership</option>
        </select>
      </div>

      {/* Hashtags */}
      <div className="form-group">
        <label htmlFor="hashtags">Hashtags (optional)</label>
        <input
          type="text"
          id="hashtags"
          name="hashtags"
          value={formData.hashtags}
          onChange={handleChange}
          placeholder="#KidsMarketing #FamilyBrands #BrandStrategy"
        />
      </div>

      {/* Additional Notes */}
      <div className="form-group">
        <label htmlFor="additionalNotes">Additional Notes (optional)</label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Any special instructions, brand guidelines, or context..."
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="submit-btn"
      >
        {isLoading ? "Generating..." : "Generate Content"}
      </button>
    </form>
  );
}
