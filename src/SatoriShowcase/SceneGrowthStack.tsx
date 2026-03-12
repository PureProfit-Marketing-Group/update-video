import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

const services = [
  { icon: "🌐", title: "Conversion Website", desc: "Clean UI, fast load, clear CTAs" },
  { icon: "📍", title: "GBP Optimization", desc: "Dominate local map results" },
  { icon: "⭐", title: "Review Funnel", desc: "Automate 5-star reviews" },
  { icon: "🤖", title: "AI Chat Bot", desc: "Qualify leads 24/7" },
  { icon: "🔍", title: "Local SEO", desc: "Rank higher organically" },
  { icon: "📈", title: "Google Ads", desc: "Immediate targeted visibility" },
];

export const SceneGrowthStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: headlineProgress,
          transform: `translateY(${interpolate(headlineProgress, [0, 1], [30, 0])}px)`,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.emerald,
            fontFamily: interFont,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          The Growth Stack
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: headlineProgress,
          transform: `translateY(${interpolate(headlineProgress, [0, 1], [20, 0])}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: colors.textPrimary,
            fontFamily: headingFont,
          }}
        >
          Six modules.{" "}
          <span style={{ color: colors.emerald }}>One system.</span>
        </span>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
          maxWidth: 1300,
        }}
      >
        {services.map((service, i) => {
          const cardProgress = spring({
            frame: frame - 15 - i * 8,
            fps,
            config: { damping: 20, stiffness: 200 },
          });
          const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
          const cardY = interpolate(cardProgress, [0, 1], [30, 0]);

          return (
            <div
              key={service.title}
              style={{
                width: 380,
                padding: 32,
                borderRadius: 16,
                background: `${colors.bgLight}cc`,
                border: `1px solid ${colors.textMuted}30`,
                opacity: cardProgress,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>
                {service.icon}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  fontFamily: headingFont,
                  marginBottom: 6,
                }}
              >
                {service.title}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  fontFamily: interFont,
                }}
              >
                {service.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
