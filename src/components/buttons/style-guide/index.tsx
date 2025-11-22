import { Button } from "@/components/ui/button";
import { useStyleGuide } from "@/hooks/use-styles";
import { Loader2Icon, SparklesIcon } from "lucide-react";

type Props = {
    images: any[];
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    projectId: string;
};

export default function GenerateStyleGuideButton({ images, fileInputRef, projectId }: Props) {
    const { handleGenerateStyleGuide, isGenerating } = useStyleGuide(projectId, images, fileInputRef);

    return (
        images.length > 0 && (
            <div className="flex justify-end">
                <Button
                    className="rounded-full"
                    onClick={handleGenerateStyleGuide}
                    disabled={isGenerating || images.some((img) => img.uploading)}
                >
                    {isGenerating ? (
                        <>
                            <Loader2Icon className="size-4 mr-2 animate-spin" />
                            Analyzing images...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="size-4 mr-2" />
                            Generate with AI
                        </>
                    )}
                </Button>
            </div>
        )
    );
}
