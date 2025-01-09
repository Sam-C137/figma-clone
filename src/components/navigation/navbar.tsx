"use client";

import { ActiveElement } from "@/types/types";
import Image from "next/image";
import { ActiveUsers } from "@/components/features/users/active-users";

interface NavbarProps {
    activeElement: ActiveElement;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleActiveElement: (element: ActiveElement) => void;
}

export function Navbar({}: NavbarProps) {
    // const isActive = (value: string | Array<ActiveElement>) =>
    //     (activeElement && activeElement.value === value) ||
    //     (Array.isArray(value) &&
    //         value.some((val) => val?.value === activeElement?.value));

    return (
        <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
            <Image
                src="/assets/logo.svg"
                alt="FigPro Logo"
                width={58}
                height={20}
            />

            <ActiveUsers />
        </nav>
    );
}
