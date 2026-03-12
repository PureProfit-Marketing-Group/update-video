import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, headingFont, interFont, categoryColors } from "./theme";

interface Props {
  items: string[];
  moreCount?: number;
}

export const SceneBugFixesBatch: React.FC<Props> = ({
  items,
  moreCount = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = categoryColors.bug_fix.primary;

  const titleProgress = spring({ frame, fps, config: { damping: 200 } });
  const titleY = interpolate(titleProgress, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Badge */}
      <div
        style={{
          padding: "6px 16px",
          borderRadius: 8,
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          opacity: titleProgress,
          transform: `scale(${titleProgress})`,
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
          Bug Fixes
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
            fontSize: 40,
            fontWeight: 700,
            fontFamily: headingFont,
            color: colors.textPrimary,
          }}
        >
          Issues Resolved
        </span>
      </div>

      {/* Fix list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 36,
          maxWidth: 700,
        }}
      >
        {items.map((item, i) => {
          const itemProgress = spring({
            frame: frame - 18 - i * 8,
            fps,
            config: { damping: 14 },
          });
          const itemX = interpolate(itemProgress, [0, 1], [-30, 0]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: itemProgress,
                transform: `translateX(${itemX}px)`,
              }}
            >
              {/* Checkmark */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${accent}20`,
                  border: `1.5px solid ${accent}50`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    color: accent,
                    fontWeight: 700,
                    fontFamily: interFont,
                    transform: `scale(${itemProgress})`,
                  }}
                >
                  ✓
                </span>
              </div>

              <span
                style={{
                  fontSize: 20,
                  color: colors.textSecondary,
                  fontFamily: interFont,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {/* More count */}
      {moreCount > 0 && (
        <div
          style={{
            marginTop: 24,
            opacity: spring({
              frame: frame - 18 - items.length * 8,
              fps,
              config: { damping: 200 },
            }),
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: colors.textMuted,
              fontFamily: interFont,
              fontStyle: "italic",
            }}
          >
            and {moreCount} more improvement{moreCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
