import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo mark animation
  const logoScale = spring({ frame, fps, config: { damping: 15 } });
  const logoRotation = interpolate(logoScale, [0, 1], [-180, 0]);

  // Brand name animation
  const nameProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });
  const nameY = interpolate(nameProgress, [0, 1], [40, 0]);

  // Tagline animation
  const taglineProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 200 },
  });
  const taglineY = interpolate(taglineProgress, [0, 1], [30, 0]);

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
  });

  // Glow pulse
  const glowScale = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.cyan}40, ${colors.violet}20, transparent)`,
          filter: "blur(40px)",
          transform: `scale(${glowScale})`,
          opacity: 0.6,
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
          boxShadow: `0 0 40px ${colors.cyan}40`,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: colors.bg,
            fontFamily: headingFont,
          }}
        >
          S
        </span>
      </div>

      {/* Brand name */}
      <div
        style={{
          marginTop: 32,
          opacity: nameProgress,
          transform: `translateY(${nameY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: headingFont,
            background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet}, ${colors.emerald})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: -1,
          }}
        >
          Satori Studios
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 16,
          opacity: taglineProgress,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        <span
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: colors.textPrimary,
            fontFamily: interFont,
          }}
        >
          Websites & Marketing for Local Service Businesses
        </span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 20,
          opacity: subtitleProgress,
        }}
      >
        <span
          style={{
            fontSize: 22,
            color: colors.textSecondary,
            fontFamily: interFont,
          }}
        >
          Turn traffic into calls, forms, and bookings
        </span>
      </div>
    </AbsoluteFill>
  );
};
