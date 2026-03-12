import React, { useCallback, useMemo } from "react";
import { Player } from "@remotion/player";
import { UpdateVideo, calculateTotalDuration } from "../UpdateVideo";
import type { WhatsNewState } from "./types";

const FPS = 30;

export interface WhatsNewModalProps extends WhatsNewState {
  /** Width of the video player in pixels (default: 960) */
  width?: number;
  /** Height of the video player in pixels (default: 540) */
  height?: number;
}

/**
 * Modal overlay that plays a "What's New" video using @remotion/player.
 *
 * Usage:
 * ```tsx
 * const whatsNew = useWhatsNew({ ... });
 * return <WhatsNewModal {...whatsNew} />;
 * ```
 */
export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
  isVisible,
  config,
  dismiss,
  width = 960,
  height = 540,
}) => {
  if (!isVisible || !config) return null;

  const totalDuration = useMemo(
    () => calculateTotalDuration(config.scenes),
    [config.scenes],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        dismiss();
      }
    },
    [dismiss],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    },
    [dismiss],
  );

  return (
    <div
      style={styles.backdrop}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="What's New"
      tabIndex={-1}
    >
      <div style={styles.container}>
        {/* Close button */}
        <button
          onClick={dismiss}
          style={styles.closeButton}
          aria-label="Close"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            {config.totalMissedUpdates} update
            {config.totalMissedUpdates !== 1 ? "s" : ""}
          </div>
          <h2 style={styles.title}>What&apos;s New</h2>
        </div>

        {/* Video player */}
        <div style={styles.playerWrapper}>
          <Player
            component={UpdateVideo}
            inputProps={config}
            durationInFrames={totalDuration}
            fps={FPS}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width,
              height,
              borderRadius: 12,
              overflow: "hidden",
            }}
            controls
            autoPlay
          />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={dismiss} style={styles.dismissButton} type="button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    animation: "fadeIn 0.2s ease-out",
  },
  container: {
    position: "relative",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 24,
    maxWidth: "95vw",
    maxHeight: "95vh",
    overflow: "auto",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: 8,
    padding: 8,
    color: "#a1a1aa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "rgba(34, 211, 238, 0.15)",
    color: "#22d3ee",
    fontSize: 13,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
    letterSpacing: "0.02em",
  },
  title: {
    color: "#fafafa",
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  playerWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    lineHeight: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  dismissButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fafafa",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
