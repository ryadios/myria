"use client";

import { Button } from "@/components/ui/button";
import { useInfiniteCanvas } from "@/hooks/use-canvas";
import { cn } from "@/lib/utils";
import { Tool } from "@/redux/slice/shapes";
import {
    ArrowRightIcon,
    CircleIcon,
    EraserIcon,
    HashIcon,
    MinusIcon,
    MousePointer2Icon,
    PencilIcon,
    SquareIcon,
    TypeIcon,
} from "lucide-react";

const tools: Array<{
    id: Tool;
    icon: React.ReactNode;
    label: string;
    description: string;
}> = [
    {
        id: "select",
        icon: <MousePointer2Icon className="w-4 h-4" />,
        label: "Select",
        description: "Select and move shapes",
    },
    {
        id: "frame",
        icon: <HashIcon className="w-4 h-4" />,
        label: "Frame",
        description: "Draw frame containers",
    },
    {
        id: "rect",
        icon: <SquareIcon className="w-4 h-4" />,
        label: "Rectangle",
        description: "Draw rectangles",
    },
    {
        id: "ellipse",
        icon: <CircleIcon className="w-4 h-4" />,
        label: "Ellipse",
        description: "Draw ellipses and circles",
    },
    {
        id: "freedraw",
        icon: <PencilIcon className="w-4 h-4" />,
        label: "Free Draw",
        description: "Draw freehand lines",
    },
    {
        id: "arrow",
        icon: <ArrowRightIcon className="w-4 h-4" />,
        label: "Arrow",
        description: "Draw arrows with direction",
    },
    {
        id: "line",
        icon: <MinusIcon className="w-4 h-4" />,
        label: "Line",
        description: "Draw straight lines",
    },
    {
        id: "text",
        icon: <TypeIcon className="w-4 h-4" />,
        label: "Text",
        description: "Add text blocks",
    },
    {
        id: "eraser",
        icon: <EraserIcon className="w-4 h-4" />,
        label: "Eraser",
        description: "Remove shapes",
    },
];

export default function ToolbarShapes() {
    const { currentTool, selectTool } = useInfiniteCanvas();

    return (
        <div className="col-span-1 flex justify-center items-center">
            <div className="flex items-center backdrop-blur-xl backdrop-[url('#displacementFilter')] bg-white/8 border border-white/12 gap-2 rounded-full p-3 saturate-150">
                {tools.map((tool) => (
                    <Button
                        key={tool.id}
                        variant="ghost"
                        size="lg"
                        onClick={() => selectTool(tool.id)}
                        className={cn(
                            "cursor-pointer rounded-full p-3",
                            currentTool === tool.id
                                ? "text-primary bg-white/12 border border-white/16"
                                : "text-primary/50 hover:bg-white/6 border border-transparent"
                        )}
                        title={`${tool.label} - ${tool.description}`}
                    >
                        {tool.icon}
                    </Button>
                ))}
            </div>
        </div>
    );
}
