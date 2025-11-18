import { ThemeContent } from "@/components/style/theme";
import { TabsContent } from "@/components/ui/tabs";
import { MoodBoardImagesQuery, StyleGuideQuery } from "@/convex/query.config";
import { MoodBoardImage } from "@/hooks/use-styles";
import { StyleGuide } from "@/redux/api/style-guide";
import { PaletteIcon } from "lucide-react";
import { mockStyleGuide } from "./mockData";
import { StyleGuideTypography } from "@/components/style/typography";
import Moodboard from "@/components/style/mood-board";

type Props = {
    searchParams: Promise<{
        project: string;
    }>;
};

export default async function Page({ searchParams }: Props) {
    const projectId = (await searchParams).project;
    const existingStyleGuide = await StyleGuideQuery(projectId);

    const guide = existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide;

    const colorGuide = guide?.colorSections || mockStyleGuide.colorSections;
    const typographyGuide = guide?.typographySections || [];

    const existingMoodBoardImages = await MoodBoardImagesQuery(projectId);
    const guideImages = existingMoodBoardImages.images._valueJSON as unknown as MoodBoardImage[];

    return (
        <div>
            <TabsContent value="colors" className="space-y-8">
                {!guideImages.length ? (
                    <div className="space-y-8">
                        <div className="text-center py-20">
                            <div className="size-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                                <PaletteIcon className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                                No colors generated yet
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                                Upload images to your mood board to generate an AI-powered style guide with colors and
                                typography
                            </p>
                        </div>
                    </div>
                ) : (
                    <ThemeContent colorGuide={colorGuide} />
                )}
            </TabsContent>

            <TabsContent value="typography">
                <StyleGuideTypography typographyGuide={typographyGuide} />
            </TabsContent>

            <TabsContent value="moodboard">
                <Moodboard guideImages={guideImages} />
            </TabsContent>
        </div>
    );
}
