import { Gradient, Pattern } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { LiveMap } from "@liveblocks/core";

export enum CursorMode {
    Hidden,
    Chat,
    ReactionSelector,
    Reaction,
}

export type CursorState =
    | {
          mode: CursorMode.Hidden;
      }
    | {
          mode: CursorMode.Chat;
          message: string;
          previousMessage: string | null;
      }
    | {
          mode: CursorMode.ReactionSelector;
      }
    | {
          mode: CursorMode.Reaction;
          reaction: string;
          isPressed: boolean;
      };

export type Reaction = {
    id: string;
    value: string;
    timestamp: number;
    point: { x: number; y: number };
};

export type ShapeData = {
    type: string;
    width: number;
    height: number;
    fill: string | Pattern | Gradient;
    left: number;
    top: number;
    objectId: string | undefined;
};

export type Attributes = {
    width: string;
    height: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fill: string;
    stroke: string;
};

export type ActiveElement = {
    name: string;
    value: string;
    icon: string;
} | null;

export interface CustomFabricObject<T extends fabric.Object>
    extends fabric.Object {
    objectId?: string;
    foo: T;
}

export type ModifyShape = {
    canvas: fabric.Canvas;
    property: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ElementDirection = {
    canvas: fabric.Canvas;
    direction: string;
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type ImageUpload = {
    file: File | undefined;
    canvas: React.RefObject<fabric.Canvas | null>;
    shapeRef: React.RefObject<fabric.Object | null>;
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type RightSidebarProps = {
    elementAttributes: Attributes;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
    fabricRef: React.RefObject<fabric.Canvas | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    isEditingRef: React.RefObject<boolean>;
    syncShapeInStorage: (obj: unknown) => void;
};

export type CanvasMouseDown = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    selectedShapeRef: React.RefObject<string | null>;
    isDrawing: React.RefObject<boolean>;
    shapeRef: React.RefObject<fabric.Object | null>;
};

export type CanvasMouseMove = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    isDrawing: React.RefObject<boolean>;
    selectedShapeRef: React.RefObject<string | null>;
    shapeRef: React.RefObject<
        | (fabric.Circle &
              fabric.Rect &
              fabric.Triangle &
              fabric.Line & { objectId: string })
        | null
    >;
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isDrawing: React.RefObject<boolean>;
    shapeRef: React.RefObject<fabric.Object | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    selectedShapeRef: React.RefObject<string | null>;
    syncShapeInStorage: (shape: fabric.Object | null) => void;
    setActiveElement: (element: ActiveElement) => void;
};

export type CanvasObjectModified = {
    options: fabric.IEvent;
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasPathCreated = {
    options: fabric.IEvent & { path: CustomFabricObject<fabric.Path> };
    syncShapeInStorage: (shape: fabric.Object) => void;
};

export type CanvasSelectionCreated = {
    options: fabric.IEvent;
    isEditingRef: React.RefObject<boolean>;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
    options: fabric.IEvent;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasObjects: ReadonlyMap<string, any> | null;
    activeObjectRef: React.RefObject<CustomFabricObject<fabric.Object> | null>;
};
