import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { adjectives, animals } from "@/lib/constants";
import jsPDF from "jspdf";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomName(): string {
    const randomAdjective =
        adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    return `${randomAdjective} ${randomAnimal}`;
}

export function getShapeInfo(shapeType: string) {
    switch (shapeType) {
        case "rect":
            return {
                icon: "/assets/rectangle.svg",
                name: "Rectangle",
            };

        case "circle":
            return {
                icon: "/assets/circle.svg",
                name: "Circle",
            };

        case "triangle":
            return {
                icon: "/assets/triangle.svg",
                name: "Triangle",
            };

        case "line":
            return {
                icon: "/assets/line.svg",
                name: "Line",
            };

        case "i-text":
            return {
                icon: "/assets/text.svg",
                name: "Text",
            };

        case "image":
            return {
                icon: "/assets/image.svg",
                name: "Image",
            };

        case "freeform":
            return {
                icon: "/assets/freeform.svg",
                name: "Free Drawing",
            };

        default:
            return {
                icon: "/assets/rectangle.svg",
                name: shapeType,
            };
    }
}

export function exportToPdf() {
    const canvas = document.querySelector("canvas");

    if (!canvas) return;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
    });

    const data = canvas.toDataURL();
    doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);
    doc.save("canvas.pdf");
}
