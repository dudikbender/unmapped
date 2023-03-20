import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { NoteRead } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const updateNoteRead = async (
    noteReadUUID: string,
    lastRead: string | undefined = new Date().toISOString(),
    starred: boolean | undefined = false
): Promise<NoteRead | PostgrestError | null> => {
    if (noteReadUUID === undefined) {
        return null;
    }
    const { data: UpdatedNoteRead, error } = await supabase
        .from("NoteReads")
        .update({ last_read: lastRead, starred: starred })
        .eq("uuid", noteReadUUID);
    if (error) {
        console.log(error);
        return error;
    }
    return UpdatedNoteRead;
};
