import { useState, useEffect, useCallback, useRef } from "react";
import type { ConsolidatedVideoConfig } from "../UpdateVideo/types";
import type { WhatsNewConfig, WhatsNewState } from "./types";
import { UpdateVideoClient } from "./api-client";

/**
 * React hook for integrating "What's New" videos into your app.
 *
 * Usage:
 * ```tsx
 * const whatsNew = useWhatsNew({
 *   apiBaseUrl: "https://updates.myapp.com",
 *   projectId: "my-app",
 *   userId: currentUser.id,
 * });
 *
 * // Auto-shows on mount if there are unseen updates.
 * // Or trigger manually: whatsNew.show()
 * return <WhatsNewModal {...whatsNew} />;
 * ```
 */
export function useWhatsNew(config: WhatsNewConfig): WhatsNewState {
  const [configData, setConfigData] =
    useState<ConsolidatedVideoConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<UpdateVideoClient | null>(null);

  if (!clientRef.current) {
    clientRef.current = new UpdateVideoClient(config.apiBaseUrl);
  }

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await clientRef.current!.getVideoConfig(
        config.projectId,
        config.userId,
        config.projectName,
        config.projectLogo,
      );
      setConfigData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch updates");
      setConfigData(null);
    } finally {
      setIsLoading(false);
    }
  }, [config.projectId, config.userId, config.projectName, config.projectLogo]);

  // Fetch on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Auto-show when config is available
  useEffect(() => {
    if (config.autoShow === false) return;
    if (!configData || isLoading) return;

    const delay = config.autoShowDelay ?? 1500;
    const timer = setTimeout(() => {
      setIsVisible(true);
      config.onShow?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [configData, isLoading, config.autoShow, config.autoShowDelay, config.onShow]);

  const show = useCallback(() => {
    if (configData) {
      setIsVisible(true);
      config.onShow?.();
    }
  }, [configData, config.onShow]);

  const markSeen = useCallback(async () => {
    try {
      await clientRef.current!.markSeen(config.projectId, config.userId);
    } catch (err) {
      console.warn("[whats-new] Failed to mark seen:", err);
    }
  }, [config.projectId, config.userId]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    config.onDismiss?.();

    if (config.markSeenOnDismiss !== false) {
      markSeen();
    }
  }, [config.onDismiss, config.markSeenOnDismiss, markSeen]);

  return {
    hasUpdates: configData !== null,
    config: configData,
    isVisible,
    isLoading,
    error,
    show,
    dismiss,
    markSeen,
    refresh: fetchConfig,
  };
}
