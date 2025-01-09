import CursorSVG from "@public/assets/CursorSVG";

interface CursorProps {
    color: string;
    x: number;
    y: number;
    message: string;
}

export function Cursor({ color, message, y, x }: CursorProps) {
    return (
        <div
            className="pointer-events-none absolute left-0 top-0"
            style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
        >
            <CursorSVG color={color} />
            {message && (
                <div
                    className="absolute left-2 top-5 rounded-3xl px-4 py-2"
                    style={{ background: color }}
                >
                    <p className="whitespace-nowrap text-sm leading-relaxed text-background">
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
}
