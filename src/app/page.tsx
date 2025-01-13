"use client";

import { Live } from "@/components/features/live";
import { Navbar } from "@/components/navigation/navbar";
import { LeftSidebar } from "@/components/navigation/left-sidebar";
import { RightSidebar } from "@/components/navigation/right-sidebar";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
    handleCanvasMouseMove,
    handleCanvasMouseDown,
    handleResize,
    initializeFabric,
    handleCanvasMouseUp,
    renderCanvas,
    handleCanvasObjectModified,
} from "@/lib/canvas";
import {
    ActiveElement,
    CanvasMouseMove,
    CustomFabricObject,
} from "@/types/types";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { CANVAS_OBJECTS_KEY, DefaultNavElement } from "@/lib/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";

export default function Home() {
    const undo = useUndo();
    const redo = useRedo();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas>(null);
    const activeObjectRef = useRef<CustomFabricObject<fabric.Object>>(null);
    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object>(null);
    const selectedShapeRef = useRef<string>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: "",
    });
    const canvasObjects = useStorage((root) => root.canvasObjects);
    const syncShapeInStorage = useMutation(({ storage }, object) => {
        if (!object) return;

        const { objectId } = object;
        const shapeData = object.toJSON();
        shapeData.objectId = objectId;
        const canvasObjects = storage.get(CANVAS_OBJECTS_KEY);
        canvasObjects.set(objectId, shapeData);
    }, []);

    const deleteAllShapes = useMutation(({ storage }) => {
        const canvasObjects = storage.get(CANVAS_OBJECTS_KEY);
        if (!canvasObjects || canvasObjects.size == 0) return true;

        for (const key of canvasObjects.keys()) {
            canvasObjects.delete(key);
        }

        return canvasObjects.size === 0;
    }, []);

    const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
        const canvasObjects = storage.get(CANVAS_OBJECTS_KEY);
        if (!canvasObjects || canvasObjects.size == 0) return;

        canvasObjects.delete(objectId);
    }, []);

    const handleActiveElement = (elem: ActiveElement) => {
        setActiveElement(elem);
        selectedShapeRef.current = elem?.value ?? "";

        switch (elem?.value) {
            case "reset":
                deleteAllShapes();
                fabricRef.current?.clear();
                setActiveElement(DefaultNavElement);
                break;
            case "delete":
                if (!fabricRef.current) break;
                handleDelete(fabricRef.current, deleteShapeFromStorage);
                setActiveElement(DefaultNavElement);
                break;
            case "image":
                imageInputRef.current?.click();
                isDrawing.current = false;

                if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = false;
                }
                break;
            default:
                break;
        }
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

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({
                options,
                canvas,
                isDrawing,
                shapeRef: shapeRef as CanvasMouseMove["shapeRef"],
                selectedShapeRef,
                syncShapeInStorage,
            });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({
                canvas,
                isDrawing,
                shapeRef: shapeRef as CanvasMouseMove["shapeRef"],
                selectedShapeRef,
                syncShapeInStorage,
                activeObjectRef,
                setActiveElement,
            });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({
                options,
                syncShapeInStorage,
            });
        });

        window.addEventListener("resize", () => {
            handleResize({ canvas: fabricRef.current });
        });

        window.addEventListener("keydown", (e) => {
            handleKeyDown({
                e,
                canvas: fabricRef.current,
                undo,
                redo,
                syncShapeInStorage,
                deleteShapeFromStorage,
            });
        });

        return () => {
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        renderCanvas({
            fabricRef,
            canvasObjects,
            activeObjectRef,
        });
    }, [canvasObjects]);

    return (
        <main className="h-screen overflow-hidden">
            <Navbar
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
                imageInputRef={imageInputRef}
                handleImageUpload={(e) => {
                    e.stopPropagation();
                    handleImageUpload({
                        file: e.target?.files?.[0],
                        canvas: fabricRef,
                        shapeRef,
                        syncShapeInStorage,
                    });
                }}
            />
            <section className="flex h-full flex-row">
                <LeftSidebar allShapes={Array.from(canvasObjects ?? [])} />
                <Live canvasRef={canvasRef} />
                <RightSidebar />
            </section>
        </main>
    );
}
