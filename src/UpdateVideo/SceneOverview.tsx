import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont, categoryColors } from "./theme";

interface Props {
  projectName: string;
  totalUpdates: number;
  categoryCounts: Record<string, number>;
}

export const SceneOverview: React.FC<Props> = ({
  projectName,
  totalUpdates,
  categoryCounts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 12 } });
  const iconRotation = interpolate(iconScale, [0, 1], [-90, 0]);

  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);

  const subtitleProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200 },
  });

  const badges = Object.entries(categoryCounts).filter(([, count]) => count > 0);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      {/* Update icon */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 22,
          background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${iconScale}) rotate(${iconRotation}deg)`,
          boxShadow: "0 0 50px #22d3ee40",
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: colors.bg,
            fontFamily: headingFont,
          }}
        >
          !
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          marginTop: 36,
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            fontFamily: headingFont,
            color: colors.textPrimary,
            letterSpacing: -1,
          }}
        >
          What's New in{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #22d3ee, #a78bfa, #34d399)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {projectName}
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 16,
          opacity: subtitleProgress,
        }}
      >
        <span
          style={{
            fontSize: 24,
            color: colors.textSecondary,
            fontFamily: interFont,
          }}
        >
          {totalUpdates} update{totalUpdates !== 1 ? "s" : ""} since your last
          visit
        </span>
      </div>

      {/* Category badges */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 40,
        }}
      >
        {badges.map(([category, count], i) => {
          const badgeProgress = spring({
            frame: frame - 40 - i * 6,
            fps,
            config: { damping: 14 },
          });
          const catColors =
            categoryColors[category as keyof typeof categoryColors];

          return (
            <div
              key={category}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 12,
                background: `${catColors.primary}15`,
                border: `1px solid ${catColors.primary}30`,
                transform: `scale(${badgeProgress})`,
                opacity: badgeProgress,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: catColors.primary,
                  boxShadow: `0 0 8px ${catColors.glow}`,
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: catColors.primary,
                  fontFamily: interFont,
                }}
              >
                {count} {catColors.label}
                {count !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
