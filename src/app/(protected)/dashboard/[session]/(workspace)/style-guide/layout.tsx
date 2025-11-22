import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HashIcon, LayoutIcon, TypeIcon } from "lucide-react";
import React from "react";

const tabs = [
    {
        value: "colors",
        label: "Colors",
        icon: HashIcon,
    },
    {
        value: "typography",
        label: "Typography",
        icon: TypeIcon,
    },
    {
        value: "moodboard",
        label: "Moodboard",
        icon: LayoutIcon,
    },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Tabs defaultValue="colors" className="w-full">
            <div className="mt-36 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div>
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-left text-center font-bold text-foreground">Style Guide</h1>
                            <p className="text-muted-foreground mt-2 text-center lg:text-left">
                                Manage your style guide for your project.
                            </p>
                        </div>
                        <TabsList className="flex w-full sm:w-fit h-auto gap-2 rounded-full backdrop-blur-xl bg-white/8 border border-white/12 saturate-150 p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white/15 data-[state=active]:backdrop-blur-xl data-[state=active]:border data-[state=active]:border-white/2 transition-all duration-200 text-xs sm:text-sm w-full px-4"
                                    >
                                        <Icon className="size-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.value}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
        </Tabs>
    );
}
