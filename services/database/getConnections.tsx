import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getConnections = async (
    userId: string
): Promise<any | PostgrestError> => {
    const { data: Connection, error } = await supabase
        .from("Connections")
        .select()
        .or(`requester_user.eq.${userId},requested_id.eq.${userId}`);
    if (error) {
        console.log(error);
        return error;
    }
    return Connection;
};
