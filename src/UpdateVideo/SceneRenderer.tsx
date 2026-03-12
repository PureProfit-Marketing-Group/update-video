import type { SceneConfig } from "./types";
import { SceneBreakingChange } from "./SceneBreakingChange";
import { SceneNewFeature } from "./SceneNewFeature";
import { SceneUIChange } from "./SceneUIChange";
import { SceneBugFixesBatch } from "./SceneBugFixesBatch";

interface Props {
  scene: SceneConfig;
}

export const SceneRenderer: React.FC<Props> = ({ scene }) => {
  switch (scene.type) {
    case "breaking_change":
      return (
        <SceneBreakingChange
          title={scene.data.title}
          description={scene.data.description}
        />
      );
    case "new_feature":
      return (
        <SceneNewFeature
          title={scene.data.title}
          description={scene.data.description}
          afterImage={scene.data.afterImage}
        />
      );
    case "ui_change":
      return (
        <SceneUIChange
          title={scene.data.title}
          description={scene.data.description}
          beforeImage={scene.data.beforeImage}
          afterImage={scene.data.afterImage}
        />
      );
    case "bug_fixes_batch":
      return (
        <SceneBugFixesBatch
          items={scene.data.items ?? []}
          moreCount={scene.data.moreCount}
        />
      );
    default:
      return null;
  }
};
