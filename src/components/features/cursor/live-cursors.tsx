import { BaseUserMeta, User } from "@liveblocks/client";
import { Cursor } from "@/components/features/cursor/cursor";
import { COLORS } from "@/lib/constants";

interface LiveCursorsProps {
    others: readonly User<Liveblocks["Presence"], BaseUserMeta>[];
}

export function LiveCursors({ others }: LiveCursorsProps) {
    return (
        <>
            {others.map(({ connectionId, presence }) => {
                if (!presence?.cursor) return null;

                return (
                    <Cursor
                        key={connectionId}
                        color={COLORS[Number(connectionId) % COLORS.length]}
                        x={presence.cursor.x}
                        y={presence.cursor.y}
                        message={presence.message ?? ""}
                    />
                );
            })}
        </>
    );
}
