"use client";

import { Redo2Icon, Undo2Icon } from "lucide-react";

export default function HistoryPill() {
    return (
        <div className="col-span-1 flex justify-start items-center">
            <div
                className="inline-flex items-center rounded-full backdrop-blur-xl bg-white/8 
                 border border-white/12 p-2 text-neutral-300 saturate-150"
                aria-hidden
            >
                <span
                    className="inline-grid h-9 w-9 place-items-center rounded-full 
                   hover:bg-white/12 transition-all cursor-pointer"
                >
                    <Undo2Icon size={18} className="opacity-80 stroke-[1.75]" />
                </span>

                <span className="mx-1 h-5 w-px rounded bg-white/16"></span>

                <span className="inline-grid h-9 w-9 place-items-center rounded-full hover:bg-white/12 transition-all cursor-pointer">
                    <Redo2Icon size={18} className="opacity-80 stroke-[1.75]" />
                </span>
            </div>
        </div>
    );
}
