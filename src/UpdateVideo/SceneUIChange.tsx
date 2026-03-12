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
  beforeImage?: string;
  afterImage?: string;
}

export const SceneUIChange: React.FC<Props> = ({
  title,
  description,
  beforeImage,
  afterImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = categoryColors.ui_change.primary;

  const badgeProgress = spring({ frame, fps, config: { damping: 14 } });

  const titleProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200 },
  });

  const descProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  // Before/after slide animation
  const slideProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, mass: 1.2 },
  });
  const hasImages = beforeImage && afterImage;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Header area */}
      <div
        style={{
          position: "absolute",
          top: hasImages ? 80 : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Badge */}
        <div
          style={{
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
            UI Update
          </span>
        </div>

        {/* Title */}
        <div style={{ marginTop: 12, opacity: titleProgress }}>
          <span
            style={{
              fontSize: hasImages ? 38 : 44,
              fontWeight: 700,
              fontFamily: headingFont,
              color: colors.textPrimary,
            }}
          >
            {title}
          </span>
        </div>

        {/* Description (only when no images) */}
        {!hasImages && (
          <div style={{ marginTop: 12, opacity: descProgress, maxWidth: 700 }}>
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
        )}
      </div>

      {/* Before/After comparison */}
      {hasImages && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            display: "flex",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Before */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: colors.textMuted,
                fontFamily: interFont,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
                opacity: descProgress,
              }}
            >
              Before
            </div>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                opacity: interpolate(slideProgress, [0, 0.3], [0, 0.6], {
                  extrapolateRight: "clamp",
                }),
                border: `1px solid ${colors.textMuted}30`,
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={beforeImage}
                style={{ width: 480, height: 300, objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: slideProgress,
              transform: `scale(${slideProgress})`,
            }}
          >
            <span
              style={{
                fontSize: 36,
                color: accent,
                fontFamily: headingFont,
              }}
            >
              →
            </span>
          </div>

          {/* After */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: accent,
                fontFamily: interFont,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 12,
                opacity: descProgress,
              }}
            >
              After
            </div>
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                opacity: slideProgress,
                border: `1px solid ${accent}40`,
                boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 30px ${categoryColors.ui_change.glow}`,
              }}
            >
              <img
                src={afterImage}
                style={{ width: 480, height: 300, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Text-only description with animated accent */}
      {!hasImages && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            width: interpolate(descProgress, [0, 1], [0, 160]),
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
