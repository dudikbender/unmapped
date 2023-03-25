declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
            CLERK_SECRET_KEY: string;
            NEXT_PUBLIC_MAPBOX_TOKEN: string;
            TEST: string;
            NEXT_PUBLIC_SUPABASE_URL: string;
            NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
        }
    }
}

export {};
