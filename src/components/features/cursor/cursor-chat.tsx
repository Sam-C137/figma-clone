import { CursorMode, CursorState } from "@/types/types";
import { useMyPresence } from "@liveblocks/react/suspense";
import CursorSVG from "@public/assets/CursorSVG";

interface CursorChatProps {
    cursor: Liveblocks["Presence"]["cursor"];
    cursorState: CursorState;
    setCursorState: (cursorState: CursorState) => void;
    updateMyPresence: ReturnType<typeof useMyPresence>[1];
}

export function CursorChat({
    cursor,
    cursorState,
    setCursorState,
    updateMyPresence,
}: CursorChatProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateMyPresence({ message: e.target.value });
        setCursorState({
            mode: CursorMode.Chat,
            previousMessage: null,
            message: e.target.value,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (cursorState.mode === CursorMode.Chat) {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: cursorState.message,
                    message: "",
                });
            }
        } else if (e.key === "Escape") {
            setCursorState({
                mode: CursorMode.Hidden,
            });
        }
    };

    return (
        <div
            className="absolute left-0 top-0"
            style={{
                transform: `translateX(${cursor?.x}px) translateY(${cursor?.y}px)`,
            }}
        >
            {cursorState.mode === CursorMode.Chat && (
                <>
                    <CursorSVG color="#000" />
                    <div
                        className="absolute left-2 top-5 rounded-[20px] bg-blue-500 px-4 py-2 text-sm leading-relaxed text-background"
                        onKeyUp={(e) => e.stopPropagation()}
                    >
                        {cursorState.previousMessage && (
                            <div>{cursorState.previousMessage}</div>
                        )}
                        <input
                            className="z-10 w-60 border-none bg-transparent text-background placeholder-blue-300 outline-none"
                            autoFocus
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                cursorState.previousMessage
                                    ? ""
                                    : "Type a message"
                            }
                            value={cursorState.message}
                            maxLength={50}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
