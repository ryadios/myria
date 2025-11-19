import InfiniteCanvas from "@/components/canvas";
import ProjectProvider from "@/components/projects/provider";
import { ProjectQuery } from "@/convex/query.config";

interface CanvasPageProps {
    searchParams: Promise<{ project?: string }>;
}

export default async function Page({ searchParams }: CanvasPageProps) {
    const params = await searchParams;
    const projectId = params.project;

    if (!projectId) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-muted-foreground">No project selected</div>
            </div>
        );
    }

    const { profile, project } = await ProjectQuery(projectId);

    if (!profile) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Authentication required</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Project not found or access denied</div>
            </div>
        );
    }

    return (
        <ProjectProvider initialProject={project}>
            <InfiniteCanvas />
        </ProjectProvider>
    );
}
