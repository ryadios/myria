"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { useProjectCreation } from "@/hooks/use-project";

export function CreateProject() {
    const { createProject, isCreating, canCreate } = useProjectCreation();
    return (
        <Button
            onClick={() => createProject()}
            disabled={!canCreate || isCreating}
            className="flex items-center gap-2 cursor-pointer rounded-full"
        >
            {isCreating ? <Loader2Icon className="size-4 animate-spin" /> : <PlusIcon className="size-4" />}
            {isCreating ? "Creating..." : "New Project"}
        </Button>
    );
}
