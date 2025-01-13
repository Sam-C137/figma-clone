"use client";

import { Live } from "@/components/features/live";
import { Navbar } from "@/components/navigation/navbar";
import { LeftSidebar } from "@/components/navigation/left-sidebar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
    handleCanvasMouseDown,
    handleResize,
    initializeFabric,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/types";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null);
    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object>(null);
    const selectedShapeRef = useRef<string>(null);
    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: "",
    });

    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem);
        selectedShapeRef.current = elem?.value ?? "";
    };

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                isDrawing,
                shapeRef,
                selectedShapeRef,
            });
        });

        window.addEventListener("resize", () => {
            handleResize({ canvas: fabricRef.current });
        });
    }, []);

    return (
        <main className="h-screen overflow-hidden">
            <Navbar
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
            />
            <section className="flex h-full flex-row">
                <LeftSidebar allShapes={[]} />
                <Live canvasRef={canvasRef} />
                <RightSidebar />
            </section>
        </main>
    );
}
