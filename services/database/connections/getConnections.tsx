import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { DatabaseConnection } from "@/services/types/connections";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getConnections = async (
    userId: string
): Promise<DatabaseConnection[] | null> => {
    const { data: connections, error } = await supabase
        .from("Connections")
        .select()
        .or(`requester_user.eq.${userId},requested_user.eq.${userId}`)
        .limit(100);
    if (error) {
        console.log(error);
        return null;
    }

    return connections;
};
