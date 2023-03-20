import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { DatabaseConnection } from "@/services/types/connections";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addConnection = async (
    requester_user: string,
    requested_user: string
): Promise<DatabaseConnection | PostgrestError | null> => {
    const connectionData = {
        requester_user: requester_user,
        requested_user: requested_user,
        accepted: false,
        accepted_date: null,
        created_at: new Date().toISOString()
    };
    const { data: Connection, error } = await supabase
        .from("Connections")
        .insert(connectionData);
    if (error) {
        console.log(error);
        return error;
    }
    if (!Connection) {
        return null;
    }
    return Connection;
};

export const acceptConnection = async (
    connectionUUID: string
): Promise<DatabaseConnection | PostgrestError | null> => {
    const { data: Connection, error } = await supabase
        .from("Connections")
        .update({ accepted: true, accepted_date: new Date().toISOString() })
        .eq("uuid", connectionUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!Connection || !connectionUUID) {
        return null;
    }
    return Connection;
};

export const deleteConnection = async (
    connectionUUID: string
): Promise<any | PostgrestError | null> => {
    const { data: Connection, error } = await supabase
        .from("Connections")
        .delete()
        .eq("uuid", connectionUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!Connection || !connectionUUID) {
        return null;
    }
    return Connection;
};
