import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const speedProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const priceProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const ctaProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15 },
  });

  const urlProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 200 },
  });

  // Pulsing glow on CTA
  const ctaGlow = interpolate(
    frame,
    [50, 65, 80, 95, 110],
    [0.3, 0.6, 0.3, 0.6, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headlineProgress,
          transform: `translateY(${interpolate(headlineProgress, [0, 1], [40, 0])}px)`,
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            fontFamily: headingFont,
            color: colors.textPrimary,
            lineHeight: 1.2,
          }}
        >
          Ready to turn{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet}, ${colors.emerald})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            traffic into calls
          </span>
          ?
        </span>
      </div>

      {/* Speed + Price badges */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 56,
        }}
      >
        <div
          style={{
            padding: "20px 40px",
            borderRadius: 12,
            background: `${colors.bgLight}cc`,
            border: `1px solid ${colors.cyan}40`,
            opacity: speedProgress,
            transform: `scale(${interpolate(speedProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.cyan,
              fontFamily: headingFont,
            }}
          >
            7–14 Days
          </div>
          <div
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              fontFamily: interFont,
              marginTop: 4,
            }}
          >
            Launch turnaround
          </div>
        </div>

        <div
          style={{
            padding: "20px 40px",
            borderRadius: 12,
            background: `${colors.bgLight}cc`,
            border: `1px solid ${colors.emerald}40`,
            opacity: priceProgress,
            transform: `scale(${interpolate(priceProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: colors.emerald,
              fontFamily: headingFont,
            }}
          >
            From $999
          </div>
          <div
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              fontFamily: interFont,
              marginTop: 4,
            }}
          >
            Simple, clear pricing
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: ctaProgress,
          transform: `scale(${interpolate(ctaProgress, [0, 1], [0.6, 1])})`,
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: 30,
            background: `linear-gradient(135deg, ${colors.cyan}${Math.round(ctaGlow * 255).toString(16).padStart(2, "0")}, ${colors.violet}${Math.round(ctaGlow * 255).toString(16).padStart(2, "0")})`,
            filter: "blur(20px)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "24px 64px",
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet})`,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: colors.bg,
              fontFamily: headingFont,
            }}
          >
            Book a Free Strategy Call
          </span>
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          marginTop: 36,
          opacity: urlProgress,
        }}
      >
        <span
          style={{
            fontSize: 24,
            color: colors.textSecondary,
            fontFamily: interFont,
            letterSpacing: 1,
          }}
        >
          satori-labs.cloud
        </span>
      </div>
    </AbsoluteFill>
  );
};
