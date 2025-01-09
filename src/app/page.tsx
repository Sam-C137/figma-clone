"use client";

import { Live } from "@/components/features/live";
import { Navbar } from "@/components/navigation/navbar";
import { LeftSidebar } from "@/components/navigation/left-sidebar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {
    handleCanvasMouseDown,
    handleResize,
    initializeFabric,
} from "@/lib/canvas";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null);
    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object>(null);
    const selectedShapeRef = useRef<string>("rectangle");

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
            <Navbar />
            <section className="flex h-full flex-row">
                <LeftSidebar />
                <Live canvasRef={canvasRef} />
                <RightSidebar />
            </section>
        </main>
    );
}
