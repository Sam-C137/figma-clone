"use client";

import { useCallback, useRef } from "react";
import { ThreadData } from "@liveblocks/client";
import { useMaxZIndex } from "@/lib/useMaxZIndex";
import { PinnedThread } from "./pinned-thread";
import {
    useEditThreadMetadata,
    useUser,
    useThreads,
} from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import React from "react";

export const Comments = () => (
    <ClientSideSuspense fallback={null}>
        {() => <CommentsOverlay />}
    </ClientSideSuspense>
);

interface OverlayThreadProps {
    thread: ThreadData<Liveblocks["ThreadMetadata"]>;
    maxZIndex: number;
}

export const CommentsOverlay = React.memo(() => {
    const { threads } = useThreads();
    const maxZIndex = useMaxZIndex();

    return (
        <div>
            {threads
                ?.filter((thread) => !thread.metadata.resolved)
                .map((thread) => (
                    <OverlayThread
                        key={thread.id}
                        thread={thread}
                        maxZIndex={maxZIndex}
                    />
                ))}
        </div>
    );
});

function OverlayThread({ thread, maxZIndex }: OverlayThreadProps) {
    const editThreadMetadata = useEditThreadMetadata();
    // const { isLoading } = useUser(thread.comments[0].userId);
    const threadRef = useRef<HTMLDivElement>(null);

    const handleIncreaseZIndex = useCallback(() => {
        if (maxZIndex === thread.metadata.zIndex) {
            return;
        }

        editThreadMetadata({
            threadId: thread.id,
            metadata: {
                zIndex: maxZIndex + 1,
            },
        });
    }, [thread, editThreadMetadata, maxZIndex]);

    // if (isLoading) {
    //     return null;
    // }

    return (
        <div
            ref={threadRef}
            id={`thread-${thread.id}`}
            className="absolute left-0 top-0 flex gap-5"
            style={{
                transform: `translate(${thread.metadata.x}px, ${thread.metadata.y}px)`,
            }}
        >
            <PinnedThread thread={thread} onFocus={handleIncreaseZIndex} />
        </div>
    );
}
