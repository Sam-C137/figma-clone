import { useCallback, useEffect, useState } from "react";
import { CursorMode, CursorState } from "@/types/types";
import { useMyPresence } from "@liveblocks/react/suspense";

export function useLive() {
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
            } else if (e.key === "e") {
                setCursorState({
                    mode: CursorMode.ReactionSelector,
                });
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

    const handlePointerUp = useCallback(() => {
        setCursorState((prevState) =>
            cursorState.mode === CursorMode.Reaction
                ? {
                      ...prevState,
                      isPressed: true,
                  }
                : prevState,
        );
    }, [cursorState.mode, setCursorState]);

    const handlePointerMove = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();

            if (
                cursor === null ||
                cursorState.mode !== CursorMode.ReactionSelector
            ) {
                const x =
                    event.clientX -
                    event.currentTarget.getBoundingClientRect().x;
                const y =
                    event.clientY -
                    event.currentTarget.getBoundingClientRect().y;

                updateMyPresence({ cursor: { x, y } });
            }
        },
        [cursor, cursorState.mode, updateMyPresence],
    );

    const handlePointerLeave = useCallback(() => {
        setCursorState({ mode: CursorMode.Hidden });

        updateMyPresence({ cursor: undefined, message: undefined });
    }, [updateMyPresence]);

    const handlePointerDown = useCallback(
        (event: React.PointerEvent) => {
            const x =
                event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y =
                event.clientY - event.currentTarget.getBoundingClientRect().y;

            updateMyPresence({ cursor: { x, y } });

            setCursorState((prevState) =>
                cursorState.mode === CursorMode.Reaction
                    ? {
                          ...prevState,
                          isPressed: true,
                      }
                    : prevState,
            );
        },
        [cursorState.mode, updateMyPresence],
    );

    return {
        cursor,
        updateMyPresence,
        cursorState,
        setCursorState,
        handlePointerUp,
        handlePointerMove,
        handlePointerLeave,
        handlePointerDown,
    };
}
