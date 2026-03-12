import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";

export const GradientBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const gradientAngle = interpolate(frame, [0, 900], [135, 225]);
  const glowX = interpolate(frame, [0, 450, 900], [20, 80, 20]);
  const glowY = interpolate(frame, [0, 300, 600, 900], [30, 70, 30, 70]);
  const glowOpacity = interpolate(frame, [0, 450, 900], [0.15, 0.25, 0.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Animated gradient glow */}
      <div
        style={{
          position: "absolute",
          width: "60%",
          height: "60%",
          left: `${glowX}%`,
          top: `${glowY}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, ${colors.cyan}40, ${colors.violet}20, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(80px)",
        }}
      />
      {/* Secondary glow */}
      <div
        style={{
          position: "absolute",
          width: "40%",
          height: "40%",
          right: `${100 - glowX}%`,
          bottom: `${100 - glowY}%`,
          transform: "translate(50%, 50%)",
          background: `radial-gradient(ellipse at center, ${colors.emerald}30, transparent 70%)`,
          opacity: glowOpacity * 0.6,
          filter: "blur(60px)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${colors.textMuted}08 1px, transparent 1px), linear-gradient(90deg, ${colors.textMuted}08 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: interpolate(frame, [0, 60], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      {/* Noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${gradientAngle}deg, transparent 0%, ${colors.bgLight}15 50%, transparent 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
