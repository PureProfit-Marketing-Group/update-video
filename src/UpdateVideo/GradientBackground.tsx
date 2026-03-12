import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";

export const GradientBackground: React.FC<{ accentColor?: string }> = ({
  accentColor = "#22d3ee",
}) => {
  const frame = useCurrentFrame();

  const glowX = interpolate(frame, [0, 600, 1200], [25, 75, 25]);
  const glowY = interpolate(frame, [0, 400, 800, 1200], [35, 65, 35, 65]);
  const glowOpacity = interpolate(frame, [0, 600, 1200], [0.12, 0.22, 0.12]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: "55%",
          height: "55%",
          left: `${glowX}%`,
          top: `${glowY}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, ${accentColor}35, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${colors.textMuted}06 1px, transparent 1px), linear-gradient(90deg, ${colors.textMuted}06 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: interpolate(frame, [0, 40], [0, 0.8], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
