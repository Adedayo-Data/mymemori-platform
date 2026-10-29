import React from "react";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  showJoinButton?: boolean;
  onJoinAction?: () => void;
}

// Glowing Glass Empty State Component matching user's design spec
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "shutter_speed",
  title = "No Live Celebrations Yet",
  description = "Live guest uploads, shared reactions, and curated story reels will light up your feed once you host or join.",
  actionText = "Create Your First Event",
  onAction,
  showJoinButton = false,
  onJoinAction,
}) => {
  return (
    <div className="flex flex-col gap-4 my-2 w-full max-w-xl md:max-w-4xl mx-auto">
      <div className="relative w-full rounded-2xl bg-surface-container/60 backdrop-blur-xl p-8 md:p-12 overflow-hidden border border-white/10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center gap-5">
          {/* Layered Badges & Center Graphic */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary-container/40 via-primary-container/30 to-tertiary/20 blur-md animate-pulse" />
            <div className="absolute -top-1 -right-1 w-9 h-9 rounded-lg bg-surface-container-highest/80 backdrop-blur-md flex items-center justify-center shadow-md rotate-12 border border-white/10">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <div className="absolute -bottom-2 -left-2 w-9 h-9 rounded-lg bg-surface-container-highest/80 backdrop-blur-md flex items-center justify-center shadow-md -rotate-6 border border-white/10">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                photo_library
              </span>
            </div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-secondary-container to-primary flex items-center justify-center shadow-lg">
              <div className="w-[72px] h-[72px] rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {icon}
                </span>
              </div>
            </div>
          </div>

          {/* Heading & Description */}
          <div className="flex flex-col gap-1.5 max-w-md">
            <h3 className="font-title-md text-2xl font-bold text-on-surface">{title}</h3>
            <p className="font-body-md text-on-surface-variant text-sm md:text-base leading-relaxed">{description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full max-w-sm gap-3 pt-2">
            {actionText && onAction && (
              <button
                onClick={onAction}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-container via-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span>{actionText}</span>
              </button>
            )}

            {showJoinButton && onJoinAction && (
              <button
                onClick={onJoinAction}
                className="w-full h-12 rounded-xl bg-surface-container-highest/60 hover:bg-white/10 backdrop-blur-md text-on-surface border border-white/10 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">qr_code_scanner</span>
                <span>Join with Code or QR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
