"use client";

import { LiveCursors } from "@/components/features/cursor/live-cursors";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { useCallback, useEffect, useState } from "react";
import { CursorChat } from "@/components/features/cursor/cursor-chat";
import { CursorMode, CursorState } from "@/types/types";

export function Live() {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence();
    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    });

    useEffect(() => {
        const onKeyup = (e: KeyboardEvent) => {
            if (e.key === "/") {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: "",
                });
            } else if (e.key === "Escape") {
                updateMyPresence({ message: "" });
                setCursorState({ mode: CursorMode.Hidden });
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") e.preventDefault();
        };

        window.addEventListener("keyup", onKeyup);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keyup", onKeyup);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [updateMyPresence]);

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });
    }, []);

    const handlePointerLeave = useCallback(() => {
        setCursorState({ mode: CursorMode.Hidden });

        updateMyPresence({ cursor: undefined, message: undefined });
    }, []);

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });
    }, []);

    return (
        <div
            className="flex h-[100dvh] w-full items-center justify-center text-center"
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerLeave={handlePointerLeave}
        >
            <h1 className="text-2xl">Bar</h1>
            {cursor && (
                <CursorChat
                    cursor={cursor}
                    cursorState={cursorState}
                    setCursorState={setCursorState}
                    updateMyPresence={updateMyPresence}
                />
            )}
            <LiveCursors others={others} />
        </div>
    );
}
