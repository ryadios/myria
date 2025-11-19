"use client";

import { useAutoSaveProjectMutation } from "@/redux/api/project";
import { useAppSelector } from "@/redux/store";
import { AlertCircleIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Autosave() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project");
    const user = useAppSelector((state) => state.profile);
    const shapesState = useAppSelector((state) => state.shapes);
    const [autoSaveProject, { isLoading: isSaving }] = useAutoSaveProjectMutation();
    const viewportState = useAppSelector((state) => state.viewport);

    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedRef = useRef<string>("");

    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const isReady = Boolean(projectId && user?.id);

    useEffect(() => {
        if (!isReady) return;
        const stateString = JSON.stringify({
            shapes: shapesState,
            viewport: viewportState,
        });

        if (stateString === lastSavedRef.current) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            lastSavedRef.current = stateString;
            if (abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();
            setSaveStatus("saving");

            try {
                await autoSaveProject({
                    projectId: projectId as string,
                    userId: user?.id as string,
                    shapesData: shapesState,
                    viewportData: {
                        scale: viewportState.scale,
                        translate: viewportState.translate,
                    },
                }).unwrap();
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } catch (err) {
                if ((err as Error)?.name === "AbortError") return;
                setSaveStatus("error");
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
        }, 1000);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [isReady, shapesState, viewportState, projectId, user?.id, autoSaveProject]);

    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort();
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    if (!isReady) return null;

    if (isSaving)
        return (
            <div className="flex items-center">
                <Loader2Icon className="size-4 animate-spin" />
            </div>
        );

    switch (saveStatus) {
        case "saved":
            return (
                <div className="flex items-center">
                    <CheckCircleIcon className="size-4" />
                </div>
            );

        case "error":
            return (
                <div className="flex items-center">
                    <AlertCircleIcon className="size-4" />
                </div>
            );
    }
    return <></>;
}
