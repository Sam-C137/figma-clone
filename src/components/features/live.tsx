"use client";

import { LiveCursors } from "@/components/features/cursor/live-cursors";
import {
    useBroadcastEvent,
    useEventListener,
    useOthers,
} from "@liveblocks/react/suspense";
import { useCallback, useState } from "react";
import { CursorChat } from "@/components/features/cursor/cursor-chat";
import { CursorMode, Reaction } from "@/types/types";
import { ReactionSelector } from "@/components/features/reaction/reaction-selector";
import { useLive } from "@/components/features/useLive";
import { FlyingReaction } from "@/components/features/reaction/flying-reaction";
import useInterval from "@/hooks/useInterval";
import { Comments } from "@/components/features/comments/comments";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { shortcuts } from "@/lib/constants";

interface LiveProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    redo: () => void;
    undo: () => void;
}

export function Live({ canvasRef, undo, redo }: LiveProps) {
    const others = useOthers();
    const {
        setCursorState,
        cursor,
        cursorState,
        updateMyPresence,
        handlePointerMove,
        handlePointerDown,
        handlePointerLeave,
        handlePointerUp,
    } = useLive();
    const [flyingReactions, setFlyingReactions] = useState<Reaction[]>([]);
    const broadcast = useBroadcastEvent();
    useEventListener((eventData) => {
        const reaction = eventData.event.reaction;
        if (reaction) {
            setFlyingReactions((prevState) =>
                prevState.concat({
                    id: crypto.randomUUID(),
                    point: { x: reaction.x, y: reaction.y },
                    value: reaction.value,
                    timestamp: Date.now(),
                }),
            );
        }
    });

    useInterval(() => {
        setFlyingReactions((reactions) =>
            reactions.filter((r) => r.timestamp > Date.now() - 3000),
        );
    }, 1000);

    useInterval(() => {
        if (
            cursorState.mode === CursorMode.Reaction &&
            cursorState.isPressed &&
            cursor
        ) {
            setFlyingReactions((prevState) =>
                prevState.concat({
                    id: crypto.randomUUID(),
                    point: { x: cursor.x, y: cursor.y },
                    value: cursorState.reaction,
                    timestamp: Date.now(),
                }),
            );

            broadcast({
                reaction: {
                    x: cursor.x,
                    y: cursor.y,
                    value: cursorState.reaction,
                },
            });
        }
    }, 100);

    const setReactions = useCallback(
        (reaction: string) => {
            setCursorState({
                mode: CursorMode.Reaction,
                reaction,
                isPressed: false,
            });
        },
        [setCursorState],
    );

    const handleContextMenuClick = useCallback((key: string) => {
        switch (key) {
            case "Chat":
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: "",
                    message: "",
                });
                break;
            case "Undo":
                undo();
                break;
            case "Redo":
                redo();
                break;
            case "Reactions":
                setCursorState({
                    mode: CursorMode.ReactionSelector,
                });
                break;
            default:
                break;
        }
    }, []);

    return (
        <ContextMenu>
            <ContextMenuTrigger
                id="canvas"
                className="relative flex h-full w-full flex-1 items-center justify-center"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerLeave={handlePointerLeave}
                onPointerUp={handlePointerUp}
            >
                <canvas ref={canvasRef} />
                {flyingReactions.map((reaction) => (
                    <FlyingReaction
                        key={reaction.id}
                        x={reaction.point.x}
                        y={reaction.point.y}
                        timestamp={reaction.timestamp}
                        value={reaction.value}
                    />
                ))}
                {cursor && (
                    <CursorChat
                        cursor={cursor}
                        cursorState={cursorState}
                        setCursorState={setCursorState}
                        updateMyPresence={updateMyPresence}
                    />
                )}
                {cursorState.mode === CursorMode.ReactionSelector && (
                    <ReactionSelector setReaction={setReactions} />
                )}
                <LiveCursors others={others} />
                <Comments />
            </ContextMenuTrigger>
            <ContextMenuContent className="right-menu-content">
                {shortcuts.map((item) => (
                    <ContextMenuItem
                        key={item.key}
                        onClick={() => handleContextMenuClick(item.name)}
                        className="right-menu-item"
                    >
                        <p className="text-primary-grey-300">{item.name}</p>
                        <p className="text-xs text-primary-grey-300">
                            {item.shortcut}
                        </p>
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    );
}
