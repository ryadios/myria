import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { InfoIcon, TypeIcon } from "lucide-react";

type Props = {
    typographyGuide: any;
};

export function StyleGuideTypography({ typographyGuide }: Props) {
    return (
        <>
            {typographyGuide.length === 0 ? (
                <div className="text-center py-20">
                    <TypeIcon className="size-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No typography generated yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Generate a style guide to see typography recommendations.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    {typographyGuide.map((section: any, index: number) => (
                        <div key={index} className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-lg font-medium text-foreground/50">{section.title}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section?.styles?.map((style: any, styleIndex: number) => (
                                    <div key={styleIndex} className="p-6 rounded-2xl backdrop-blur-xl space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-medium text-foreground">{style.name}</h4>
                                            {style.description && (
                                                <div className="flex gap-2 items-center">
                                                    <p className="text-sm text-muted-foreground">{style.description}</p>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <InfoIcon className="size-4" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-xs text-muted space-y-1">
                                                            <div>
                                                                <div>Font: {style.fontFamily}</div>
                                                                <div>Size: {style.fontSize}</div>
                                                                <div>Weight: {style.fontWeight}</div>
                                                                <div>Line Height: {style.lineHeight}</div>
                                                                {style.letterSpacing && (
                                                                    <div>Letter Spacing: {style.letterSpacing}</div>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className="text-foreground"
                                            style={{
                                                fontFamily: style.fontFamily,
                                                fontSize: style.fontSize,
                                                fontWeight: style.fontWeight,
                                                lineHeight: style.lineHeight,
                                                letterSpacing: style.letterSpacing || "normal",
                                            }}
                                        >
                                            The quick brown fox jumps over the lazy dog
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
