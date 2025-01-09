import { Avatar } from "./avatar";
import { useOthers, useSelf } from "@liveblocks/react";
import { generateRandomName } from "@/lib/utils";
import { useMemo } from "react";

export function ActiveUsers() {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;

    return useMemo(() => {
        return (
            <div className="flex items-center justify-center gap-1 py-2">
                <div className="flex pl-3">
                    {currentUser && (
                        <Avatar
                            name="You"
                            className="border-[3px] border-primary-green"
                        />
                    )}

                    {users.slice(0, 3).map(({ connectionId }) => {
                        return (
                            <Avatar
                                key={connectionId}
                                name={generateRandomName()}
                                className="-ml-3"
                            />
                        );
                    })}

                    {hasMoreUsers && (
                        <div className="ml-[-0.75rem] flex h-[56px] w-[56px] min-w-[56px] items-center justify-center rounded-full border-4 border-white bg-[#9ca3af] text-white">
                            +{users.length - 3}
                        </div>
                    )}
                </div>
            </div>
        );
    }, [users.length]);
}
