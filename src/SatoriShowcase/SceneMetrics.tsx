import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont } from "./theme";

const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  frame: number;
  fps: number;
  delay: number;
  color: string;
  label: string;
}> = ({ value, prefix = "", suffix = "", frame, fps, delay, color, label }) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const countProgress = interpolate(
    frame - delay,
    [0, 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const displayValue = Math.round(value * countProgress);
  const y = interpolate(progress, [0, 1], [40, 0]);

  return (
    <div
      style={{
        textAlign: "center",
        opacity: progress,
        transform: `translateY(${y}px)`,
        flex: 1,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          fontFamily: headingFont,
          color,
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 18,
          color: colors.textSecondary,
          fontFamily: interFont,
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SceneMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const metrics = [
    {
      value: 38,
      prefix: "+",
      suffix: "%",
      label: "More Calls",
      color: colors.cyan,
      delay: 20,
    },
    {
      value: 2.1,
      prefix: "",
      suffix: "×",
      label: "Form Leads",
      color: colors.violet,
      delay: 30,
    },
    {
      value: 27,
      prefix: "+",
      suffix: "",
      label: "Reviews / 30 Days",
      color: colors.emerald,
      delay: 40,
    },
    {
      value: 7.8,
      prefix: "",
      suffix: "%",
      label: "Avg Conversion Rate",
      color: colors.cyan,
      delay: 50,
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
      {/* Section label */}
      <div
        style={{
          opacity: headlineProgress,
          transform: `translateY(${interpolate(headlineProgress, [0, 1], [30, 0])}px)`,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.cyan,
            fontFamily: interFont,
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          Proven Outcomes
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: headlineProgress,
          transform: `translateY(${interpolate(headlineProgress, [0, 1], [30, 0])}px)`,
          textAlign: "center",
          marginBottom: 64,
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
          Performance you can{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            track
          </span>
          — not guess
        </span>
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: "flex",
          gap: 60,
          width: "100%",
          maxWidth: 1400,
          justifyContent: "center",
        }}
      >
        {metrics.map((metric) => (
          <AnimatedCounter
            key={metric.label}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            label={metric.label}
            color={metric.color}
            frame={frame}
            fps={fps}
            delay={metric.delay}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
