"use client";

import { ActiveElement } from "@/types/types";
import Image from "next/image";
import { ActiveUsers } from "@/components/features/users/active-users";
import { navElements } from "@/lib/constants";
import { ShapesMenu } from "@/components/navigation/shapes-menu";
import { NewThread } from "@/components/features/comments/new-thread";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
    activeElement: ActiveElement;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement | null>) => void;
    handleActiveElement: (element: ActiveElement) => void;
}

export function Navbar({
    activeElement,
    imageInputRef,
    handleActiveElement,
    handleImageUpload,
}: NavbarProps) {
    const isActive = (value: string | Array<ActiveElement>) =>
        (activeElement && activeElement.value === value) ||
        (Array.isArray(value) &&
            value.some((val) => val?.value === activeElement?.value));

    return (
        <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
            <Image
                src="/assets/logo.svg"
                alt="FigPro Logo"
                width={58}
                height={20}
            />

            <ul className="flex flex-row">
                {navElements.map((element) => (
                    <li
                        key={element.name}
                        onClick={() => {
                            if (Array.isArray(element.value)) return;
                            handleActiveElement(element as ActiveElement);
                        }}
                        className={cn(
                            "group flex items-center justify-center px-2.5 py-5",
                            isActive(element.value)
                                ? "bg-primary-green"
                                : "hover:bg-primary-grey-200",
                        )}
                    >
                        {Array.isArray(element.value) ? (
                            <ShapesMenu
                                item={element}
                                activeElement={activeElement}
                                imageInputRef={imageInputRef}
                                handleActiveElement={handleActiveElement}
                                handleImageUpload={handleImageUpload}
                            />
                        ) : element.value === "comments" ? (
                            <NewThread>
                                <Button className="relative h-5 w-5 bg-transparent object-contain hover:bg-transparent">
                                    <Image
                                        src={element.icon}
                                        alt={element.name}
                                        fill
                                        className={
                                            isActive(element.value)
                                                ? "invert"
                                                : ""
                                        }
                                    />
                                </Button>
                            </NewThread>
                        ) : (
                            <Button className="relative h-5 w-5 bg-transparent object-contain hover:bg-transparent">
                                <Image
                                    src={element.icon}
                                    alt={element.name}
                                    fill
                                    className={
                                        isActive(element.value) ? "invert" : ""
                                    }
                                />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            <ActiveUsers />
        </nav>
    );
}
