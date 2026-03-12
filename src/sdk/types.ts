import type { ConsolidatedVideoConfig } from "../UpdateVideo/types";

export interface WhatsNewConfig {
  /** Base URL of the Update Video API (e.g., "https://updates.myapp.com") */
  apiBaseUrl: string;
  /** Project ID to fetch updates for */
  projectId: string;
  /** Current user's ID */
  userId: string;
  /** Project display name (shown in the video) */
  projectName?: string;
  /** Project logo URL */
  projectLogo?: string;
  /** Auto-show the modal when there are unseen updates (default: true) */
  autoShow?: boolean;
  /** Delay before auto-showing in ms (default: 1500) */
  autoShowDelay?: number;
  /** Mark updates as seen when the modal is dismissed (default: true) */
  markSeenOnDismiss?: boolean;
  /** Callback when modal is shown */
  onShow?: () => void;
  /** Callback when modal is dismissed */
  onDismiss?: () => void;
  /** Callback when video playback completes */
  onComplete?: () => void;
}

export interface WhatsNewState {
  /** Whether there are unseen updates */
  hasUpdates: boolean;
  /** The video config (null if no unseen updates or still loading) */
  config: ConsolidatedVideoConfig | null;
  /** Whether the modal is currently visible */
  isVisible: boolean;
  /** Whether the config is being fetched */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Show the modal */
  show: () => void;
  /** Dismiss the modal */
  dismiss: () => void;
  /** Manually mark updates as seen */
  markSeen: () => Promise<void>;
  /** Re-fetch the config */
  refresh: () => Promise<void>;
}
