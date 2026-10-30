import React, { useState } from "react";
import toast from "react-hot-toast";
import { CONTACT_INFO } from "../../data/legalContent";

interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOPIC_LABELS: Record<string, string> = {
    general: "General Inquiry",
    support: "Event & App Support",
    partnership: "Venue & Event Partnership",
    privacy: "Privacy & Data Request",
    feedback: "Feedback & Feature Request"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const topicLabel = TOPIC_LABELS[formData.topic] || "Inquiry";
    const subject = encodeURIComponent(`[MyMemori ${topicLabel}] - Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Topic: ${topicLabel}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSent from MyMemori Platform (${CONTACT_INFO.website})`
    );

    const mailtoUrl = `mailto:${CONTACT_INFO.supportEmail}?subject=${subject}&body=${body}`;

    // Open user's default email client
    window.location.href = mailtoUrl;

    toast.success(`Opening your email client to send to ${CONTACT_INFO.supportEmail}!`);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        topic: "general",
        message: ""
      });
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 font-hanken">
            Your Name <span className="text-[#ff4f93]">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Alex Morgan"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#ff4f93]/60 focus:ring-1 focus:ring-[#ff4f93]/50 transition-all font-hanken"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 font-hanken">
            Your Email <span className="text-[#ff4f93]">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="alex@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#ff4f93]/60 focus:ring-1 focus:ring-[#ff4f93]/50 transition-all font-hanken"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 font-hanken">
          Topic
        </label>
        <select
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[#181820] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff4f93]/60 focus:ring-1 focus:ring-[#ff4f93]/50 transition-all font-hanken"
        >
          <option value="general">General Inquiry</option>
          <option value="support">Technical / Event Support</option>
          <option value="partnership">Event Host & Venue Partnerships</option>
          <option value="privacy">Privacy & Data Request</option>
          <option value="feedback">Feature Request / Feedback</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 font-hanken">
          Message <span className="text-[#ff4f93]">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help your next nightlife experience or event?"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#ff4f93]/60 focus:ring-1 focus:ring-[#ff4f93]/50 transition-all font-hanken resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-3 px-6 rounded-xl font-sora font-semibold text-sm text-white bg-gradient-to-r from-[#ff4f93] to-[#c0299b] hover:opacity-90 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(255,79,147,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <span>Send Message</span>
        )}
      </button>
    </form>
  );
};
