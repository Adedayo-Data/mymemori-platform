import React from "react";
import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { PRIVACY_CONTENT } from "../data/legalContent";

const Privacy: React.FC = () => {
  return (
    <LegalPageLayout
      currentTab="privacy"
      title={PRIVACY_CONTENT.title}
      subtitle={PRIVACY_CONTENT.subtitle}
      lastUpdated={PRIVACY_CONTENT.lastUpdated}
    >
      <div className="space-y-8 text-white/80 font-hanken">
        {PRIVACY_CONTENT.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <h2 className="text-lg font-bold font-sora text-white text-[#ffb0cd]">
              {section.title}
            </h2>
            <div className="space-y-2.5">
              {section.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-white/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </LegalPageLayout>
  );
};

export default Privacy;
