import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { BlockedConnection } from "@/services/types/blockedConnection";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getConnections = async (
    userId: string
): Promise<BlockedConnection[] | null> => {
    const { data: blockList, error } = await supabase
        .from("BlockList")
        .select()
        .eq("user_id", userId)
        .limit(100);
    if (error) {
        console.log(error);
        return null;
    }

    return blockList;
};
