"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { CircleQuestionMarkIcon, HashIcon, LayoutTemplateIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useAppSelector } from "@/redux/store";
import { CreateProject } from "../buttons/project/create-project";
import Autosave from "../canvas/autosave";

type TabProps = { label: string; href: string; icon?: React.ReactNode };

export default function Navbar() {
    const params = useSearchParams();
    const pathname = usePathname();
    const projectId = params.get("project");

    const me = useAppSelector((state) => state.profile);

    const tabs: TabProps[] = [
        {
            label: "Canvas",
            href: `/dashboard/${me.name}/canvas?project=${projectId}`,
            icon: <HashIcon className="size-4" />,
        },
        {
            label: "Style Guide",
            href: `/dashboard/${me.name}/style-guide?project=${projectId}`,
            icon: <LayoutTemplateIcon className="size-4" />,
        },
    ];

    const project = useQuery(api.projects.getProject, projectId ? { projectId: projectId as Id<"projects"> } : "skip");

    const hasCanvas = pathname.includes("canvas");
    const hasStyleGuide = pathname.includes("style-guide");
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-4">
                <Link
                    href={`/dashboard/${me.name}`}
                    className="size-8 rounded-full border-3 border-white bg-black flex items-center justify-center"
                >
                    <div className="size-4 rounded-full bg-white"></div>
                </Link>
                {!hasCanvas ||
                    (!hasStyleGuide && (
                        <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white/12 backdrop-blur-xl bg-white/8 px-4 py-2 text-sm saturate-150">
                            Project / {project?.name}
                        </div>
                    ))}
            </div>
            <div className="lg:flex hidden items-center justify-center gap-2">
                <div className="flex items-center gap-2 backdrop-blur-xl bg-white/8 border border-white/12 rounded-full p-2 saturate-150">
                    {tabs.map((t) => (
                        <Link
                            key={t.href}
                            href={t.href}
                            className={cn(
                                "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
                                `${pathname}?project=${projectId}` === t.href
                                    ? "bg-white/12 text-white-border border-white/16 backdrop-blur-sm"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/6 border border-transparent"
                            )}
                        >
                            <span
                                className={
                                    `${pathname}?project=${projectId}` === t.href
                                        ? "opacity-100"
                                        : "opacity-70 group-hover:opacity-90"
                                }
                            >
                                {t.icon}
                            </span>
                            <span>{t.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4 justify-end">
                <span className="text-sm text-white/50">TODO: credits</span>
                <Button
                    variant="secondary"
                    className="rounded-full size-12 flex items-center justify-center backdrop-blur-xl bg-white/8 border border-white/12 saturate-150 hover:bg-white/12"
                >
                    <CircleQuestionMarkIcon className="size-5 text-white" />
                </Button>
                <Avatar className="size-12 ml-2">
                    <AvatarImage src={me.image || ""} />
                    <AvatarFallback>
                        <UserIcon className="size-5 text-black" />
                    </AvatarFallback>
                </Avatar>
                {hasCanvas && <Autosave />}
                {!hasCanvas && !hasStyleGuide && <CreateProject />}
            </div>
        </div>
    );
}
