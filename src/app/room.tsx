"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/core";
import { Loader } from "./loader";

export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider
            publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY}
        >
            <RoomProvider
                id="my-room"
                initialStorage={{
                    canvasObjects: new LiveMap(),
                }}
            >
                <ClientSideSuspense fallback={<Loader />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
