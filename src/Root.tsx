import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { SatoriShowcase, SATORI_DURATION } from "./SatoriShowcase";
import { UpdateVideo, calculateTotalDuration } from "./UpdateVideo";
import { updateVideoSchema } from "./UpdateVideo/schemas";
import { mockTier1, mockTier2, mockTier3 } from "./UpdateVideo/mock-data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SatoriShowcase"
        component={SatoriShowcase}
        durationInFrames={SATORI_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Update Videos — one per tier for preview */}
      <Composition
        id="UpdateVideo-Tier1"
        component={UpdateVideo}
        durationInFrames={calculateTotalDuration(mockTier1.scenes)}
        fps={30}
        width={1920}
        height={1080}
        schema={updateVideoSchema}
        defaultProps={mockTier1}
      />

      <Composition
        id="UpdateVideo-Tier2"
        component={UpdateVideo}
        durationInFrames={calculateTotalDuration(mockTier2.scenes)}
        fps={30}
        width={1920}
        height={1080}
        schema={updateVideoSchema}
        defaultProps={mockTier2}
      />

      <Composition
        id="UpdateVideo-Tier3"
        component={UpdateVideo}
        durationInFrames={calculateTotalDuration(mockTier3.scenes)}
        fps={30}
        width={1920}
        height={1080}
        schema={updateVideoSchema}
        defaultProps={mockTier3}
      />

      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};
