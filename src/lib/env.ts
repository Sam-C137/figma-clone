import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_LIVEBLOCKS_KEY: z.string(),
    FOO: z.number(),
});

envSchema.parse(envSchema);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}
