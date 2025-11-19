import { inngest } from "@/inngest/client";
import { NextResponse, type NextRequest } from "next/server";

interface UpdateProjectRequest {
    projectId: string;
    shapesData: {
        shapes: Record<string, unknown>;
        tool: string;
        selected: Record<string, unknown>;
        frameCounter: number;
    };
    viewportData?: {
        scale: number;
        translate: { x: number; y: number };
    };
}

export async function PATCH(request: NextRequest) {
    try {
        const body: UpdateProjectRequest & { userId?: string } = await request.json();

        const { projectId, shapesData, viewportData, userId } = body;

        if (!projectId || !userId || !shapesData) {
            return NextResponse.json({ error: "Project ID, User ID and shapes data are required" }, { status: 400 });
        }

        const eventResult = await inngest.send({
            name: "project/autosave.requested",
            data: { projectId, userId, shapesData, viewportData },
        });

        return NextResponse.json({
            success: true,
            message: "Project autosave initiated",
            eventId: eventResult.ids[0],
        });
    } catch (err) {
        return NextResponse.json(
            {
                error: "Failed to autosave project",
                message: err instanceof Error ? err.message : "Unknown Error",
            },
            { status: 500 }
        );
    }
}
