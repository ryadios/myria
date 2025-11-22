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
        const { userMessage, generatedUIId, currentHTML, projectId } = body;

        if (!generatedUIId || !currentHTML || !projectId) {
            return NextResponse.json(
                {
                    error: "Missing required fields: generatedUIId, currentHTML, projectId",
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

        const raw = styleGuide._valueJSON as any;

        // Get inspiration images
        const inspirationResult = await InspirationImagesQuery(projectId);
        const images = inspirationResult.images._valueJSON as unknown as {
            url: string;
        }[];
        const imageUrls = images.map((img) => img.url).filter(Boolean);

        const colors = Array.isArray(raw.colorSections) ? raw.colorSections : Object.values(raw.colorSections);
        const typography = Array.isArray(raw.typographySections) ? raw.typographySections : [];

        // const colors = styleGuideData?.colorSections || [];
        // const typography = styleGuideData?.typographySections || [];

        // Build the user prompt for dynamic workflow generation
        let userPrompt = `CRITICAL: You are redesigning a SPECIFIC WORKFLOW PAGE, not creating a new page from scratch.

    
USER REQUEST: "${userMessage}"

CURRENT WORKFLOW PAGE HTML TO REDESIGN:
${currentHTML}

WORKFLOW REDESIGN REQUIREMENTS:
1. MODIFY THE PROVIDED HTML ABOVE - do not create a completely new page
2. Apply the user's requested changes to the existing workflow page design
3. Keep the same page type and core functionality (Dashboard, Settings, Profile, or Listing)
4. Maintain the existing layout structure and component hierarchy
5. Preserve all functional elements while applying visual/content changes
6. Keep the same general organization and workflow purpose

MODIFICATION GUIDELINES:
1. Start with the provided HTML structure as your base
2. Apply the requested changes (colors, layout, content, styling, etc.)
3. Keep all existing IDs and semantic structure intact
4. Maintain shadcn/ui component patterns and classes
5. Preserve responsive design and accessibility features
6. Update content, styling, or layout as requested but keep core structure

IMPORTANT: 
- DO NOT generate a completely different page
- DO NOT revert to any "original" or "main" page design
- DO redesign the specific workflow page shown in the HTML above
- DO apply the user's changes to that specific page

    colors: ${colors
        .map((color: any) =>
            color.swatches
                .map((swatch: any) => {
                    return `${swatch.name}: ${swatch.hexColor}, ${swatch.description}`;
                })
                .join(", ")
        )
        .join(", ")}
    typography: ${typography
        .map((typography: any) =>
            typography.styles
                .map((style: any) => {
                    return `${style.name}: ${style.description}, ${style.fontFamily}, ${style.fontWeight}, ${style.fontSize}, ${style.lineHeight}`;
                })
                .join(", ")
        )
        .join(", ")}

Please generate the modified version of the provided workflow page HTML with the requested changes applied.`;

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

        userPrompt += `\n\nPlease generate a professional redesigned workflow page that incorporates the requested changes while maintaining the core functionality and design consistency.`;

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
