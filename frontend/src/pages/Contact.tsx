import React from "react";
import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { CONTACT_INFO } from "../data/legalContent";
import { ContactForm } from "../components/legal/ContactForm";

const Contact: React.FC = () => {
  return (
    <LegalPageLayout
      currentTab="contact"
      title={CONTACT_INFO.title}
      subtitle={CONTACT_INFO.subtitle}
    >
      <div className="space-y-10">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
                General Inquiries & Support
              </p>
              <h3 className="text-base font-semibold font-sora text-white">Need help with an event or photo?</h3>
              <p className="text-xs text-white/50 mt-1 mb-4">{CONTACT_INFO.responseHours}</p>
            </div>
            <a
              href={`mailto:${CONTACT_INFO.supportEmail}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffb0cd] hover:text-white transition-colors"
            >
              <span>{CONTACT_INFO.supportEmail}</span>
              <span>&rarr;</span>
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-1">
                Event Partnerships & Venues
              </p>
              <h3 className="text-base font-semibold font-sora text-white">Host nightlife memories at your venue</h3>
              <p className="text-xs text-white/50 mt-1 mb-4">Clubs, promoters, festival organizers</p>
            </div>
            <a
              href={`mailto:${CONTACT_INFO.partnershipsEmail}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffb0cd] hover:text-white transition-colors"
            >
              <span>{CONTACT_INFO.partnershipsEmail}</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10">
          <h2 className="text-xl font-bold font-sora text-white mb-2">Send Us a Direct Message</h2>
          <p className="text-xs text-white/50 mb-6">
            Fill in the details below and a member of our team will reach back out.
          </p>
          <ContactForm />
        </div>

        {/* Social Presence */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
          <span>Connect with us across social media</span>
          <div className="flex items-center gap-4">
            {CONTACT_INFO.socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ffb0cd] transition-colors"
              >
                {social.name} ({social.handle})
              </a>
            ))}
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
};

export default Contact;
