import { LiquidGlassButton } from "@/components/buttons/liquid-glass";
import { useUpdateContainer } from "@/hooks/use-styles";
import { GeneratedUIShape } from "@/redux/slice/shapes";
import { DownloadIcon, MessageCircleIcon, WorkflowIcon } from "lucide-react";

type Props = {
    shape: GeneratedUIShape;
    toggleChat: (generatedUUID: string) => void;
    generateWorkflow: (generatedUUID: string) => void;
    exportDesign: (generatedUUID: string, element: HTMLElement | null) => void;
};

export default function GeneratedUI({ shape, toggleChat, generateWorkflow, exportDesign }: Props) {
    const { containerRef, sanitizeHtml } = useUpdateContainer(shape);

    const handleExportDesign = () => {
        if (!shape.uiSpecData) {
            console.warn("No UI data to export");
            return;
        }

        exportDesign(shape.id, containerRef.current);
    };

    const handleGenerateWorkflow = () => {
        generateWorkflow(shape.id);
    };

    const handleToggleChat = () => {
        toggleChat(shape.id);
    };

    return (
        <div
            className="absolute pointer-events-none"
            ref={containerRef}
            style={{
                left: shape.x,
                top: shape.y,
                width: shape.w,
                height: "auto",
            }}
        >
            <div
                className="w-full h-auto relative rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm"
                style={{
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    padding: "16px",
                    height: "auto",
                    minHeight: "120px",
                    position: "relative",
                }}
            >
                <div
                    className="h-auto w-full"
                    style={{
                        pointerEvents: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <div className="absolute -top-8 right-0 flex gap-2">
                        <LiquidGlassButton
                            size="sm"
                            variant="subtle"
                            onClick={handleExportDesign}
                            disabled={!shape.uiSpecData}
                            style={{ pointerEvents: "auto" }}
                        >
                            <DownloadIcon size={12} />
                            Export
                        </LiquidGlassButton>
                        <LiquidGlassButton
                            size="sm"
                            variant="subtle"
                            onClick={handleGenerateWorkflow}
                            style={{ pointerEvents: "auto" }}
                        >
                            <WorkflowIcon size={12} />
                            Generate Workflow
                        </LiquidGlassButton>
                        <LiquidGlassButton
                            size="sm"
                            variant="subtle"
                            onClick={handleToggleChat}
                            style={{ pointerEvents: "auto" }}
                        >
                            <MessageCircleIcon size={12} />
                            Design Chat
                        </LiquidGlassButton>
                    </div>
                    {shape.uiSpecData ? (
                        <div
                            className="h-auto"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(shape.uiSpecData),
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center p-8 text-white/60">
                            <div className="animate-pulse">Generating design...</div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className="absolute -top-6 left-0 text-xs px-2 py-1 rounded whitespace-nowrap text-white/60 bg-black/40"
                style={{ fontSize: "10px" }}
            >
                Generated UI
            </div>
        </div>
    );
}
