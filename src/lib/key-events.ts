import { fabric } from "fabric";

import { CustomFabricObject } from "@/types/types";

export const handleCopy = (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 0) {
        const serializedObjects = activeObjects.map((obj) => obj.toObject());
        localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
    }

    return activeObjects;
};

export const handlePaste = (
    canvas: fabric.Canvas,
    syncShapeInStorage: (shape: fabric.Object) => void,
) => {
    if (!canvas || !(canvas instanceof fabric.Canvas)) {
        console.error("Invalid canvas object. Aborting paste operation.");
        return;
    }

    const clipboardData = localStorage.getItem("clipboard");

    if (clipboardData) {
        try {
            const parsedObjects = JSON.parse(clipboardData);
            parsedObjects.forEach((objData: fabric.Object) => {
                // convert the plain javascript objects retrieved from localStorage into fabricjs objects (deserialization)
                fabric.util.enlivenObjects(
                    [objData],
                    (enlivenedObjects: fabric.Object[]) => {
                        enlivenedObjects.forEach((enlivenedObj) => {
                            // Offset the pasted objects to avoid overlap with existing objects
                            enlivenedObj.set({
                                left: enlivenedObj.left || 0 + 20,
                                top: enlivenedObj.top || 0 + 20,
                                objectId: crypto.randomUUID(),
                                fill: "#aabbcc",
                            } as CustomFabricObject<fabric.Object>);

                            canvas.add(enlivenedObj);
                            syncShapeInStorage(enlivenedObj);
                        });
                        canvas.renderAll();
                    },
                    "fabric",
                );
            });
        } catch (error) {
            console.error("Error parsing clipboard data:", error);
        }
    }
};

export const handleDelete = (
    canvas: fabric.Canvas,
    deleteShapeFromStorage: (id: string) => void,
) => {
    const activeObjects =
        canvas.getActiveObjects() as CustomFabricObject<fabric.Object>[];
    if (!activeObjects || activeObjects.length === 0) return;

    if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => {
            if (!obj.objectId) return;
            canvas.remove(obj);
            deleteShapeFromStorage(obj.objectId);
        });
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
};

export const handleKeyDown = ({
    e,
    canvas,
    undo,
    redo,
    syncShapeInStorage,
    deleteShapeFromStorage,
}: {
    e: KeyboardEvent;
    canvas: fabric.Canvas | null;
    undo: () => void;
    redo: () => void;
    syncShapeInStorage: (shape: fabric.Object) => void;
    deleteShapeFromStorage: (id: string) => void;
}) => {
    if (!canvas) return;

    // Check if the key pressed is ctrl/cmd + c (copy)
    if ((e?.ctrlKey || e?.metaKey) && e.code === "KeyC") {
        handleCopy(canvas);
    }

    // Check if the key pressed is ctrl/cmd + v (paste)
    if ((e?.ctrlKey || e?.metaKey) && e.code === "KeyV") {
        handlePaste(canvas, syncShapeInStorage);
    }

    // Check if the key pressed is delete/backspace (delete)
    // if (e.code === "Backspace" || e.code === "Delete") {
    //     handleDelete(canvas, deleteShapeFromStorage);
    // }

    // check if the key pressed is ctrl/cmd + x (cut)
    if ((e?.ctrlKey || e?.metaKey) && e.code === "KeyX") {
        handleCopy(canvas);
        handleDelete(canvas, deleteShapeFromStorage);
    }

    // check if the key pressed is ctrl/cmd + z (undo)
    if ((e?.ctrlKey || e?.metaKey) && e.code === "KeyZ") {
        undo();
    }

    // check if the key pressed is ctrl/cmd + y (redo)
    if ((e?.ctrlKey || e?.metaKey) && e.code === "KeyY") {
        redo();
    }

    // Prevent forward slash key default behavior
    if (e.code === "Slash" && !e.shiftKey) {
        e.preventDefault();
    }
};
