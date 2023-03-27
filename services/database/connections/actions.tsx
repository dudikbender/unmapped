import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addConnection = async (
    requester_user: string | undefined,
    requested_user: string | undefined
): Promise<any | PostgrestError | null> => {
    if (!requester_user || !requested_user) {
        return null;
    }
    const connectionData = {
        requester_user: requester_user,
        requested_user: requested_user,
        accepted: false,
        accepted_date: null,
        created_at: new Date().toISOString(),
        uuid: uuidv4()
    };
    const { data: Connection, error } = await supabase
        .from("Connections")
        .upsert(connectionData)
        .select("*");
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
): Promise<number | PostgrestError | null> => {
    const { status, error } = await supabase
        .from("Connections")
        .update({ accepted: true, accepted_date: new Date().toISOString() })
        .eq("uuid", connectionUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!status || !connectionUUID) {
        return null;
    }
    console.log("Backend", status);
    return status;
};

export const deleteConnection = async (
    connectionUUID: string
): Promise<any | PostgrestError | null> => {
    const { status, error } = await supabase
        .from("Connections")
        .delete()
        .eq("uuid", connectionUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!status || !connectionUUID) {
        return null;
    }
    return status;
};
