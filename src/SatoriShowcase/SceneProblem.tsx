import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main text animation
  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const headlineY = interpolate(headlineProgress, [0, 1], [50, 0]);

  // Stats animation
  const stat1Progress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 200 },
  });
  const stat2Progress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 200 },
  });
  const stat3Progress = spring({
    frame: frame - 45,
    fps,
    config: { damping: 200 },
  });

  // Line animation
  const lineWidth = interpolate(frame, [15, 45], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stats = [
    { value: "2.1%", label: "Industry avg conversion", progress: stat1Progress },
    { value: "4.2s", label: "Avg page load time", progress: stat2Progress },
    { value: "73%", label: "SMBs unhappy with ROI", progress: stat3Progress },
  ];

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
          transform: `translateY(${headlineY}px)`,
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: colors.textPrimary,
            fontFamily: headingFont,
            lineHeight: 1.2,
          }}
        >
          Your website should{" "}
          <span style={{ color: colors.cyan }}>generate leads</span>
          {"\n"}— not just look pretty.
        </span>
      </div>

      {/* Divider line */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: `linear-gradient(90deg, ${colors.cyan}, ${colors.violet})`,
          marginTop: 48,
          marginBottom: 48,
          borderRadius: 1,
        }}
      />

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 80,
          justifyContent: "center",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              textAlign: "center",
              opacity: stat.progress,
              transform: `translateY(${interpolate(stat.progress, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: colors.textMuted,
                fontFamily: headingFont,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 18,
                color: colors.textSecondary,
                fontFamily: interFont,
                marginTop: 8,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
