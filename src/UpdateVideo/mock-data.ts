import type { ConsolidatedVideoConfig } from "./types";

/**
 * Tier 1: Few updates, full detail on each.
 */
export const mockTier1: ConsolidatedVideoConfig = {
  projectName: "ProFlow Dashboard",
  tier: 1,
  totalMissedUpdates: 2,
  scenes: [
    {
      type: "new_feature",
      durationInFrames: 150, // 5s
      data: {
        title: "Smart Scheduling",
        description:
          "Appointments now auto-detect conflicts and suggest the next available time slot based on your team's availability.",
      },
    },
    {
      type: "ui_change",
      durationInFrames: 120, // 4s
      data: {
        title: "Refreshed Sidebar Navigation",
        description:
          "Cleaner layout with collapsible sections and quick-access favorites.",
      },
    },
  ],
};

/**
 * Tier 2: Moderate updates, grouped by category.
 */
export const mockTier2: ConsolidatedVideoConfig = {
  projectName: "ProFlow Dashboard",
  tier: 2,
  totalMissedUpdates: 7,
  scenes: [
    {
      type: "breaking_change",
      durationInFrames: 150, // 5s
      data: {
        title: "API Authentication Updated",
        description:
          "API keys now use v2 format. Existing v1 keys will stop working on April 1st. Update your integrations to use the new key format.",
      },
    },
    {
      type: "new_feature",
      durationInFrames: 135, // 4.5s
      data: {
        title: "Real-Time Analytics Dashboard",
        description:
          "Track website visitors, form submissions, and call volume in real time with live-updating charts.",
      },
    },
    {
      type: "new_feature",
      durationInFrames: 135, // 4.5s
      data: {
        title: "Automated Review Requests",
        description:
          "Send review requests via SMS or email after each completed job. Customizable templates and timing.",
      },
    },
    {
      type: "ui_change",
      durationInFrames: 105, // 3.5s
      data: {
        title: "Redesigned Settings Page",
        description:
          "Settings are now organized into tabbed sections for easier navigation.",
      },
    },
    {
      type: "bug_fixes_batch",
      durationInFrames: 120, // 4s
      data: {
        title: "Bug Fixes",
        description: "Several issues resolved",
        items: [
          "Fixed calendar not syncing with Google Calendar",
          "Resolved PDF invoice generation errors",
          "Fixed notification sounds on mobile",
        ],
      },
    },
  ],
};

/**
 * Tier 3: Many updates, highlights only.
 */
export const mockTier3: ConsolidatedVideoConfig = {
  projectName: "ProFlow Dashboard",
  tier: 3,
  totalMissedUpdates: 18,
  scenes: [
    {
      type: "breaking_change",
      durationInFrames: 150,
      data: {
        title: "New Permission System",
        description:
          "User roles have been restructured. Admin, Manager, and Staff roles now have updated default permissions. Review your team's access levels.",
      },
    },
    {
      type: "new_feature",
      durationInFrames: 120,
      data: {
        title: "AI-Powered Lead Scoring",
        description:
          "Leads are now automatically scored based on engagement, source, and behavior patterns.",
      },
    },
    {
      type: "new_feature",
      durationInFrames: 120,
      data: {
        title: "Multi-Location Support",
        description:
          "Manage multiple business locations from a single dashboard with per-location analytics.",
      },
    },
    {
      type: "ui_change",
      durationInFrames: 105,
      data: {
        title: "Dark Mode",
        description:
          "Full dark mode support across the entire application. Toggle in Settings → Appearance.",
      },
    },
    {
      type: "bug_fixes_batch",
      durationInFrames: 105,
      data: {
        title: "Bug Fixes",
        description: "Issues resolved",
        items: [
          "Fixed data export timeout on large datasets",
          "Resolved timezone issues in scheduling",
        ],
        moreCount: 8,
      },
    },
  ],
};
