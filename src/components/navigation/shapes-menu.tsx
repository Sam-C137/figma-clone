"use client";

import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { navElements } from "@/lib/constants";
import { ActiveElement } from "@/types/types";

interface ShapesMenuProps {
    item: (typeof navElements)[0];
    activeElement:
        | (Omit<ShapesMenuProps["item"], "value"> & {
              value: string | ShapesMenuProps["item"]["value"];
          })
        | null;
    handleActiveElement: (element: ActiveElement) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement | null>) => void;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ShapesMenu({
    item,
    activeElement,
    handleActiveElement,
    handleImageUpload,
    imageInputRef,
}: ShapesMenuProps) {
    const isDropdownElem =
        Array.isArray(item.value) &&
        item.value.some((elem) => elem?.value === activeElement?.value);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="no-ring">
                    <Button
                        className="relative h-5 w-5 bg-transparent object-contain hover:bg-transparent"
                        onClick={() =>
                            handleActiveElement(item as ActiveElement)
                        }
                    >
                        <Image
                            src={
                                isDropdownElem
                                    ? (activeElement?.icon ?? "")
                                    : item.icon
                            }
                            alt={item.name}
                            fill
                            className={isDropdownElem ? "invert" : ""}
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="mt-5 flex flex-col gap-y-1 border-none bg-primary-black py-4 text-white">
                    {Array.isArray(item.value) &&
                        item.value.map((elem) => (
                            <Button
                                key={elem?.name}
                                onClick={() =>
                                    elem &&
                                    handleActiveElement(elem as ActiveElement)
                                }
                                className={`flex h-fit justify-between gap-10 rounded-none px-5 py-3 focus:border-none ${
                                    activeElement?.value === elem?.value
                                        ? "bg-primary-green"
                                        : "hover:bg-primary-grey-200"
                                }`}
                            >
                                <div className="group flex items-center gap-2">
                                    <Image
                                        src={elem?.icon as string}
                                        alt={elem?.name as string}
                                        width={20}
                                        height={20}
                                        className={
                                            activeElement?.value === elem?.value
                                                ? "invert"
                                                : ""
                                        }
                                    />
                                    <p
                                        className={`text-sm ${
                                            activeElement?.value === elem?.value
                                                ? "text-primary-black"
                                                : "text-white"
                                        }`}
                                    >
                                        {elem?.name}
                                    </p>
                                </div>
                            </Button>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <input
                type="file"
                className="hidden"
                ref={imageInputRef}
                accept="image/*"
                onChange={handleImageUpload}
            />
        </>
    );
}
