/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { prompts } from "@/prompts";
import {
    ConsumeCreditsQuery,
    CreditsBalanceQuery,
    StyleGuideQuery,
    InspirationImagesQuery,
} from "@/convex/query.config";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userMessage, generatedUIId, currentHTML, wireframeSnapshot, projectId } = body;

        if (!generatedUIId || !currentHTML || !projectId) {
            return NextResponse.json(
                {
                    error: "Missing required fields: userMessage, generatedUIId, currentHTML, wireframeSnapshot projectId",
                },
                { status: 400 }
            );
        }

        // Check credits (workflow generation consumes 1 credit)
        const { ok: balanceOk, balance: balanceBalance } = await CreditsBalanceQuery();
        if (!balanceOk || balanceBalance === 0) {
            return NextResponse.json({ error: "No credits available" }, { status: 400 });
        }

        // Consume credits
        const { ok } = await ConsumeCreditsQuery({ amount: 1 });
        if (!ok) {
            return NextResponse.json({ error: "Failed to consume credits" }, { status: 500 });
        }

        // Get project ID from request body for style guide
        const { styleGuide } = await StyleGuideQuery(projectId);
        // const styleGuideData = styleGuide._valueJSON as unknown as {
        //     colorSections: unknown[];
        //     typographySections: unknown[];
        // };

        // Get inspiration images
        const inspirationResult = await InspirationImagesQuery(projectId);
        const images = inspirationResult.images._valueJSON as unknown as {
            url: string;
        }[];
        const imageUrls = images.map((img) => img.url).filter(Boolean);

        const raw = styleGuide._valueJSON as any;

        const colors = Array.isArray(raw.colorSections) ? raw.colorSections : Object.values(raw.colorSections);
        const typography = Array.isArray(raw.typographySections) ? raw.typographySections : [];

        // const colors = styleGuideData?.colorSections || [];
        // const typography = styleGuideData?.typographySections || [];

        // Build the user prompt for dynamic workflow generation
        let userPrompt = `Please redesign this UI based on my request: "${userMessage}"`;

        if (currentHTML) {
            userPrompt += `\n\nCurrent HTML for reference:\n${currentHTML.substring(0, 1000)}...`;
        }

        if (wireframeSnapshot) {
            userPrompt += `\n\nWireframe Context: I'm providing a wireframe image that shows the EXACT original design layout and structure that this UI was generated from. This wireframe represents the specific frame that was used to create the current design. Please use this as visual context to understand the intended layout, structure, and design elements when making improvements. The wireframe shows the original wireframe/mockup that the user drew or created.`;
        } else {
            console.log("📄 No wireframe context available - using text-only regeneration");
        }

        if (colors.length > 0) {
            userPrompt += `\n\nStyle Guide Colors:\n${(
                colors as Array<{
                    swatches: Array<{
                        name: string;
                        hexColor: string;
                        description: string;
                    }>;
                }>
            )
                .map((color) =>
                    color.swatches
                        .map((swatch) => `${swatch.name}: ${swatch.hexColor}, ${swatch.description}`)
                        .join(", ")
                )
                .join(", ")}`;
        }

        if (typography.length > 0) {
            userPrompt += `\n\nTypography:\n${(
                typography as Array<{
                    styles: Array<{
                        name: string;
                        description: string;
                        fontFamily: string;
                        fontWeight: string;
                        fontSize: string;
                        lineHeight: string;
                    }>;
                }>
            )
                .map((typo) =>
                    typo.styles
                        .map(
                            (style) =>
                                `${style.name}: ${style.description}, ${style.fontFamily}, ${style.fontWeight}, ${style.fontSize}, ${style.lineHeight}`
                        )
                        .join(", ")
                )
                .join(", ")}`;
        }

        if (imageUrls.length > 0) {
            userPrompt += `\n\nInspiration Images Available: ${imageUrls.length} reference images for visual style and inspiration.`;
        }

        userPrompt += `\n\nPlease generate a completely new HTML design based on my request while following the style guide, maintaining professional quality, and considering the wireframe context for layout understanding.`;

        // Create streaming response for workflow page generation
        const result = streamText({
            model: google("gemini-2.5-pro"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: userPrompt,
                        },
                        {
                            type: "image",
                            image: wireframeSnapshot,
                        },
                        ...imageUrls.map((url) => ({
                            type: "image" as const,
                            image: url,
                        })),
                    ],
                },
            ],
            system: prompts.generativeUi.system,
            temperature: 0.7,
        });

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        const encoder = new TextEncoder();
                        controller.enqueue(encoder.encode(chunk));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Workflow generation API error:", error);
        return NextResponse.json(
            {
                error: "Failed to proccess workflow generation request",
                details: error instanceof Error ? error.message : "Unknown Error",
            },
            { status: 500 }
        );
    }
}
