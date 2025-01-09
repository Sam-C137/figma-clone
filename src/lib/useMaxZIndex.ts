import { useMemo } from "react";
import { useThreads } from "@liveblocks/react/suspense";
import { ThreadData } from "@liveblocks/core";

export const useMaxZIndex = () => {
    const { threads } = useThreads() as unknown as {
        threads: ThreadData<{ zIndex: number }>[];
    };

    return useMemo(() => {
        return Math.max(...[...threads.map((t) => t.metadata.zIndex)]);
    }, [threads]);
};
