import { fabric } from "fabric";
import {
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasObjectModified,
    CanvasObjectScaling,
    CanvasPathCreated,
    CanvasSelectionCreated,
    RenderCanvas,
} from "@/types/types";
import { defaultNavElement } from "@/lib/constants";
import { createSpecificShape } from "./shapes";

export const initializeFabric = ({
    fabricRef,
    canvasRef,
}: {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => {
    const canvasElement = document.getElementById("canvas");

    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasElement?.clientWidth,
        height: canvasElement?.clientHeight,
    });

    fabricRef.current = canvas;

    return canvas;
};

export const handleCanvasMouseDown = ({
    options,
    canvas,
    selectedShapeRef,
    isDrawing,
    shapeRef,
}: CanvasMouseDown) => {
    const pointer = canvas.getPointer(options.e);

    /**
     * get target object i.e., the object that is clicked
     * findtarget() returns the object that is clicked
     *
     * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
     */
    const target = canvas.findTarget(options.e, false);

    canvas.isDrawingMode = false;

    if (selectedShapeRef.current === "freeform") {
        isDrawing.current = true;
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 5;
        return;
    }

    canvas.isDrawingMode = false;

    if (
        target &&
        (target.type === selectedShapeRef.current ||
            target.type === "activeSelection")
    ) {
        isDrawing.current = false;

        canvas.setActiveObject(target);

        /**
         * setCoords() is used to update the controls of the object
         * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
         */
        target.setCoords();
    } else {
        isDrawing.current = true;

        shapeRef.current = createSpecificShape(
            selectedShapeRef.current,
            pointer as unknown as PointerEvent,
        );

        if (shapeRef.current) {
            // add: http://fabricjs.com/docs/fabric.Canvas.html#add
            canvas.add(shapeRef.current);
        }
    }
};

export const handleCanvaseMouseMove = ({
    options,
    canvas,
    isDrawing,
    selectedShapeRef,
    shapeRef,
    syncShapeInStorage,
}: CanvasMouseMove) => {
    if (!isDrawing.current) return;
    if (selectedShapeRef.current === "freeform") return;

    canvas.isDrawingMode = false;
    const pointer = canvas.getPointer(options.e);

    switch (selectedShapeRef?.current) {
        case "rectangle":
            shapeRef.current?.set({
                width: pointer.x - (shapeRef.current?.left || 0),
                height: pointer.y - (shapeRef.current?.top || 0),
            });
            break;

        case "circle":
            shapeRef.current.set({
                radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
            });
            break;

        case "triangle":
            shapeRef.current?.set({
                width: pointer.x - (shapeRef.current?.left || 0),
                height: pointer.y - (shapeRef.current?.top || 0),
            });
            break;

        case "line":
            shapeRef.current?.set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;

        case "image":
            shapeRef.current?.set({
                width: pointer.x - (shapeRef.current?.left || 0),
                height: pointer.y - (shapeRef.current?.top || 0),
            });
            break;
        default:
            break;
    }

    // render objects on canvas
    // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
    canvas.renderAll();

    if (shapeRef.current?.objectId) {
        syncShapeInStorage(shapeRef.current);
    }
};

export const handleCanvasMouseUp = ({
    canvas,
    isDrawing,
    shapeRef,
    activeObjectRef,
    selectedShapeRef,
    syncShapeInStorage,
    setActiveElement,
}: CanvasMouseUp) => {
    isDrawing.current = false;
    if (selectedShapeRef.current === "freeform") return;

    // sync shape in storage as drawing is stopped
    syncShapeInStorage(shapeRef.current);

    // set everything to null
    shapeRef.current = null;
    activeObjectRef.current = null;
    selectedShapeRef.current = null;

    // if canvas is not in drawing mode, set active element to default nav element after 700ms
    if (!canvas.isDrawingMode) {
        setTimeout(() => {
            setActiveElement(defaultNavElement);
        }, 700);
    }
};

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({
    options,
    syncShapeInStorage,
}: CanvasObjectModified) => {
    const target = options.target;
    if (!target) return;

    if (target?.type == "activeSelection") {
        // fix this
    } else {
        syncShapeInStorage(target);
    }
};

// update shape in storage when path is created when in freeform mode
export const handlePathCreated = ({
    options,
    syncShapeInStorage,
}: CanvasPathCreated) => {
    const path = options.path;
    if (!path) return;

    path.set({
        objectId: crypto.randomUUID(),
    });

    syncShapeInStorage(path);
};

export const handleCanvasObjectMoving = ({
    options,
}: {
    options: fabric.IEvent;
}) => {
    const target = options.target as fabric.Object;

    const canvas = target.canvas as fabric.Canvas;

    target.setCoords();

    if (target && target.left) {
        target.left = Math.max(
            0,
            Math.min(
                target.left,
                (canvas.width || 0) -
                    (target.getScaledWidth() || target.width || 0),
            ),
        );
    }

    if (target && target.top) {
        target.top = Math.max(
            0,
            Math.min(
                target.top,
                (canvas.height || 0) -
                    (target.getScaledHeight() || target.height || 0),
            ),
        );
    }
};

export const handleCanvasSelectionCreated = ({
    options,
    isEditingRef,
    setElementAttributes,
}: CanvasSelectionCreated) => {
    if (isEditingRef.current) return;

    if (!options?.selected) return;

    const selectedElement = options?.selected[0] as fabric.Object;

    // if only one element is selected, set element attributes
    if (selectedElement && options.selected.length === 1) {
        // calculate scaled dimensions of the object
        const scaledWidth = selectedElement?.scaleX
            ? (selectedElement?.width ?? 1) * selectedElement?.scaleX
            : selectedElement?.width;

        const scaledHeight = selectedElement?.scaleY
            ? (selectedElement?.height ?? 1) * selectedElement?.scaleY
            : selectedElement?.height;

        setElementAttributes({
            width: scaledWidth?.toFixed(0).toString() || "",
            height: scaledHeight?.toFixed(0).toString() || "",
            fill: selectedElement?.fill?.toString() || "",
            stroke: selectedElement?.stroke || "",
            // @ts-expect-error foo
            fontSize: selectedElement?.fontSize || "",
            // @ts-expect-error foo
            fontFamily: selectedElement?.fontFamily || "",
            // @ts-expect-error foo
            fontWeight: selectedElement?.fontWeight || "",
        });
    }
};

export const handleCanvasObjectScaling = ({
    options,
    setElementAttributes,
}: CanvasObjectScaling) => {
    const selectedElement = options.target;

    const scaledWidth = selectedElement?.scaleX
        ? (selectedElement?.width ?? 1) * selectedElement?.scaleX
        : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
        ? (selectedElement?.height ?? 1) * selectedElement?.scaleY
        : selectedElement?.height;

    setElementAttributes((prev) => ({
        ...prev,
        width: scaledWidth?.toFixed(0).toString() || "",
        height: scaledHeight?.toFixed(0).toString() || "",
    }));
};

export const renderCanvas = ({
    fabricRef,
    canvasObjects,
    activeObjectRef,
}: RenderCanvas) => {
    fabricRef.current?.clear();

    // render all objects on canvas
    Array.from(canvasObjects, ([objectId, objectData]) => {
        /**
         * enlivenObjects() is used to render objects on canvas.
         * It takes two arguments:
         * 1. objectData: object data to render on canvas
         * 2. callback: callback function to execute after rendering objects
         * on canvas
         *
         * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
         */
        fabric.util.enlivenObjects(
            [objectData],
            (enlivenedObjects: fabric.Object[]) => {
                enlivenedObjects.forEach((enlivenedObj) => {
                    if (activeObjectRef.current?.objectId === objectId) {
                        fabricRef.current?.setActiveObject(enlivenedObj);
                    }

                    fabricRef.current?.add(enlivenedObj);
                });
            },
            /**
             * specify namespace of the object for fabric to render it on canvas
             * A namespace is a string that is used to identify the type of
             * object.
             *
             * Fabric Namespace: http://fabricjs.com/docs/fabric.html
             */
            "fabric",
        );
    });

    fabricRef.current?.renderAll();
};

export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
    const canvasElement = document.getElementById("canvas");
    if (!canvasElement) return;

    if (!canvas) return;

    canvas.setDimensions({
        width: canvasElement.clientWidth,
        height: canvasElement.clientHeight,
    });
};

export const handleCanvasZoom = ({
    options,
    canvas,
}: {
    options: fabric.IEvent & { e: WheelEvent };
    canvas: fabric.Canvas;
}) => {
    const delta = options.e?.deltaY;
    let zoom = canvas.getZoom();

    const minZoom = 0.2;
    const maxZoom = 1;
    const zoomStep = 0.001;

    zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

    // zoomToPoint: http://fabricjs.com/docs/fabric.Canvas.html#zoomToPoint
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);

    options.e.preventDefault();
    options.e.stopPropagation();
};
