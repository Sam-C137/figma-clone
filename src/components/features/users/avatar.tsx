import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
    name: string;
    className?: string;
}

export function Avatar({ name, className }: AvatarProps) {
    return (
        <div
            className={cn(
                "hover:before:opacity-1 relative -ml-3 flex h-9 w-9 place-content-center rounded-full border-[3px] border-white bg-[#9ca3af] before:absolute before:bottom-full before:z-[1] before:mb-[10px] before:whitespace-nowrap before:rounded-[8px] before:bg-black before:px-[5px] before:py-[10px] before:text-sm before:text-white before:opacity-0 before:transition-opacity before:duration-150 before:ease-in-out before:content-[attr(data-tooltip)]",
                className,
            )}
            data-tooltip={name}
        >
            <Image
                src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
                fill
                className="h-full w-full rounded-full"
                alt={name}
                unoptimized
            />
        </div>
    );
}
