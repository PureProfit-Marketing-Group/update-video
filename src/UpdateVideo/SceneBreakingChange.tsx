import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont, categoryColors } from "./theme";

interface Props {
  title: string;
  description: string;
}

export const SceneBreakingChange: React.FC<Props> = ({
  title,
  description,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Warning pulse
  const pulseOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.15, 0.35, 0.15]
  );

  // Badge entrance
  const badgeScale = spring({ frame, fps, config: { damping: 12 } });

  // Title
  const titleProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });
  const titleY = interpolate(titleProgress, [0, 1], [25, 0]);

  // Description
  const descProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200 },
  });
  const descY = interpolate(descProgress, [0, 1], [20, 0]);

  const accent = categoryColors.breaking_change.primary;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Warning glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}30, transparent 70%)`,
          opacity: pulseOpacity,
          filter: "blur(60px)",
        }}
      />

      {/* Warning badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 20px",
          borderRadius: 8,
          background: `${accent}20`,
          border: `1px solid ${accent}50`,
          transform: `scale(${badgeScale})`,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: accent,
            fontFamily: interFont,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Breaking Change
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          marginTop: 28,
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            fontFamily: headingFont,
            color: colors.textPrimary,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </span>
      </div>

      {/* Description */}
      <div
        style={{
          marginTop: 20,
          opacity: descProgress,
          transform: `translateY(${descY}px)`,
          textAlign: "center",
          maxWidth: 750,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: colors.textSecondary,
            fontFamily: interFont,
            lineHeight: 1.5,
          }}
        >
          {description}
        </span>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          width: interpolate(titleProgress, [0, 1], [0, 200]),
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
