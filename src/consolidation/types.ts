export type UpdateCategory =
  | "ui_change"
  | "new_feature"
  | "bug_fix"
  | "breaking_change";

export interface UpdateRecord {
  id: string;
  projectId: string;
  deployId: string;
  createdAt: Date;
  category: UpdateCategory;
  priority: 1 | 2 | 3 | 4 | 5;
  featureArea: string;
  affectedComponents: string[];
  title: string;
  description: string;
  visuals?: {
    beforeScreenshot?: string;
    afterScreenshot?: string;
  };
}
