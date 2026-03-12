import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

interface Props {
  projectName: string;
  totalUpdates: number;
  moreCount?: number;
}

export const SceneWrapUp: React.FC<Props> = ({
  projectName,
  totalUpdates,
  moreCount = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });

  const subtitleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  const ctaProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15 },
  });

  // Glow pulse
  const glowPulse = interpolate(frame % 90, [0, 45, 90], [0.4, 0.7, 0.4]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* CTA glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #22d3ee25, #a78bfa15, transparent)",
          filter: "blur(60px)",
          opacity: glowPulse,
        }}
      />

      {/* Checkmark */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #22d3ee, #34d399)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${titleScale})`,
          boxShadow: "0 0 40px #34d39940",
        }}
      >
        <span
          style={{
            fontSize: 36,
            color: colors.bg,
            fontWeight: 700,
            fontFamily: headingFont,
          }}
        >
          ✓
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          marginTop: 28,
          opacity: subtitleProgress,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            fontFamily: headingFont,
            color: colors.textPrimary,
          }}
        >
          You're all caught up!
        </span>
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: 16,
          opacity: subtitleProgress,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: colors.textSecondary,
            fontFamily: interFont,
          }}
        >
          {totalUpdates} update{totalUpdates !== 1 ? "s" : ""} to{" "}
          <span style={{ color: "#22d3ee", fontWeight: 600 }}>
            {projectName}
          </span>
        </span>
      </div>

      {/* More improvements note */}
      {moreCount > 0 && (
        <div style={{ marginTop: 12, opacity: subtitleProgress }}>
          <span
            style={{
              fontSize: 18,
              color: colors.textMuted,
              fontFamily: interFont,
            }}
          >
            Plus {moreCount} more minor improvement
            {moreCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* CTA button */}
      <div
        style={{
          marginTop: 40,
          opacity: ctaProgress,
          transform: `scale(${ctaProgress})`,
        }}
      >
        <div
          style={{
            padding: "14px 36px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            boxShadow: `0 0 30px #22d3ee30`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.bg,
              fontFamily: interFont,
            }}
          >
            See Full Changelog
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
