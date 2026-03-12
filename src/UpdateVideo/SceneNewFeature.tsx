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
  afterImage?: string;
}

export const SceneNewFeature: React.FC<Props> = ({
  title,
  description,
  afterImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = categoryColors.new_feature.primary;

  // Badge
  const badgeProgress = spring({ frame, fps, config: { damping: 14 } });

  // Title
  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });
  const titleY = interpolate(titleProgress, [0, 1], [25, 0]);

  // Description
  const descProgress = spring({
    frame: frame - 22,
    fps,
    config: { damping: 200 },
  });

  // Screenshot
  const imgProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15 },
  });
  const imgScale = interpolate(imgProgress, [0, 1], [0.9, 1]);

  // Sparkle effect
  const sparkle1 = interpolate(frame % 90, [0, 45, 90], [0, 1, 0]);
  const sparkle2 = interpolate((frame + 30) % 90, [0, 45, 90], [0, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: afterImage ? "flex-start" : "center",
        paddingLeft: afterImage ? 100 : 0,
      }}
    >
      {/* Sparkle dots */}
      {[
        { x: "15%", y: "20%", op: sparkle1 },
        { x: "82%", y: "30%", op: sparkle2 },
        { x: "75%", y: "75%", op: sparkle1 },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            opacity: s.op * 0.6,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: afterImage ? "row" : "column",
          alignItems: afterImage ? "center" : "center",
          gap: afterImage ? 60 : 0,
          width: "100%",
          justifyContent: "center",
          paddingRight: afterImage ? 100 : 0,
        }}
      >
        {/* Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: afterImage ? "flex-start" : "center",
            maxWidth: afterImage ? 600 : 900,
            flexShrink: 0,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 8,
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
              transform: `scale(${badgeProgress})`,
              opacity: badgeProgress,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: accent,
                fontFamily: interFont,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              New Feature
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              marginTop: 24,
              opacity: titleProgress,
              transform: `translateY(${titleY}px)`,
            }}
          >
            <span
              style={{
                fontSize: 44,
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
          <div style={{ marginTop: 16, opacity: descProgress }}>
            <span
              style={{
                fontSize: 21,
                color: colors.textSecondary,
                fontFamily: interFont,
                lineHeight: 1.5,
              }}
            >
              {description}
            </span>
          </div>
        </div>

        {/* Screenshot */}
        {afterImage && (
          <div
            style={{
              opacity: imgProgress,
              transform: `scale(${imgScale})`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 0 40px ${accent}20, 0 20px 60px rgba(0,0,0,0.4)`,
              border: `1px solid ${colors.textMuted}30`,
              flexShrink: 0,
            }}
          >
            <img
              src={afterImage}
              style={{
                width: 560,
                height: 360,
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
