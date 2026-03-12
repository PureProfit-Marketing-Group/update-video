import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

export const SceneCaseStudy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const stat1 = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const stat2 = spring({ frame: frame - 30, fps, config: { damping: 200 } });
  const stat3 = spring({ frame: frame - 40, fps, config: { damping: 200 } });
  const quoteProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200 },
  });

  const stats = [
    {
      value: "+267%",
      label: "Calls / Month",
      sub: "20 → 74",
      color: colors.cyan,
      progress: stat1,
    },
    {
      value: "+142",
      label: "New Reviews",
      sub: "45 → 187",
      color: colors.violet,
      progress: stat2,
    },
    {
      value: "-61%",
      label: "Cost Per Lead",
      sub: "$57 → $22",
      color: colors.emerald,
      progress: stat3,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: headerProgress,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [20, 0])}px)`,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.violet,
            fontFamily: interFont,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          Case Study
        </span>
      </div>

      {/* Client name */}
      <div
        style={{
          opacity: headerProgress,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [20, 0])}px)`,
          marginBottom: 48,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: colors.textPrimary,
            fontFamily: headingFont,
          }}
        >
          ProFlow Plumbing — Phoenix, AZ
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginBottom: 56,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              textAlign: "center",
              opacity: stat.progress,
              transform: `translateY(${interpolate(stat.progress, [0, 1], [30, 0])}px)`,
              padding: "32px 48px",
              borderRadius: 16,
              background: `${colors.bgLight}cc`,
              border: `1px solid ${stat.color}30`,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                fontFamily: headingFont,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 18,
                color: colors.textPrimary,
                fontFamily: interFont,
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 15,
                color: colors.textMuted,
                fontFamily: interFont,
                marginTop: 4,
              }}
            >
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        style={{
          maxWidth: 1000,
          textAlign: "center",
          opacity: quoteProgress,
          transform: `translateY(${interpolate(quoteProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: colors.textSecondary,
            fontFamily: interFont,
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          "Satori built our site and within three months I had to hire two guys
          to keep up. The review system alone is worth every penny."
        </div>
        <div
          style={{
            fontSize: 16,
            color: colors.textMuted,
            fontFamily: interFont,
            marginTop: 12,
          }}
        >
          — Ray Delgado, Owner
        </div>
      </div>
    </AbsoluteFill>
  );
};
