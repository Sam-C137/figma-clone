import { Dimensions } from "@/components/features/settings/dimension";
import { Color } from "@/components/features/settings/color";
import { Export } from "@/components/features/settings/export";
import { Text } from "@/components/features/settings/text";
import { fabric } from "fabric";
import { Attributes } from "@/types/types";
import { modifyShape } from "@/lib/shapes";
import { useRef } from "react";

interface RightSidebarProps {
    elementAttributes: Attributes;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
    fabricRef: React.RefObject<fabric.Canvas | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    isEditingRef: React.RefObject<boolean>;
    syncShapeInStorage: (obj: fabric.Object) => void;
}

export function RightSidebar({
    elementAttributes,
    setElementAttributes,
    fabricRef,
    activeObjectRef,
    isEditingRef,
    syncShapeInStorage,
}: RightSidebarProps) {
    const colorInputRef = useRef<HTMLInputElement>(null);
    const strokeInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (property: string, value: string) => {
        if (!isEditingRef.current) isEditingRef.current = true;
        setElementAttributes((prevState) => ({
            ...prevState,
            [property]: value,
        }));

        if (!fabricRef.current) return;
        modifyShape({
            canvas: fabricRef.current,
            property,
            value,
            activeObjectRef,
            syncShapeInStorage,
        });
    };

    return (
        <nav className="sticky right-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-2 border-primary-grey-200 bg-primary-black text-primary-grey-300 max-sm:hidden">
            <h3 className="px-5 pt-4 text-xs">Design</h3>
            <span className="mt-3 border-b border-primary-grey-200 px-5 pb-4 text-xs text-primary-grey-300">
                Make changes to canvas as you like
            </span>
            <Dimensions
                width={elementAttributes.width}
                height={elementAttributes.height}
                handleInputChange={handleInputChange}
                isEditingRef={isEditingRef}
            />
            <Text
                fontFamily={elementAttributes.fontFamily}
                fontSize={elementAttributes.fontSize}
                fontWeight={elementAttributes.fontWeight}
                handleInputChange={handleInputChange}
            />
            <Color
                inputRef={colorInputRef}
                attribute={elementAttributes.fill}
                placeholder="color"
                handleInputChange={handleInputChange}
                attributeType="fill"
            />
            <Color
                inputRef={strokeInputRef}
                attribute={elementAttributes.stroke}
                placeholder="stroke"
                handleInputChange={handleInputChange}
                attributeType="stroke"
            />
            <Export />
        </nav>
    );
}
