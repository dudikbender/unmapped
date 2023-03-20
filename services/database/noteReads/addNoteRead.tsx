import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { NoteRead } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addNoteRead = async (
    noteReadData: NoteRead
): Promise<any | PostgrestError | null> => {
    console.log("Initial Data: ", noteReadData);
    const { data: NoteRead, error } = await supabase
        .from("NoteReads")
        .insert(noteReadData)
        .select("*");
    if (error) {
        console.log(error);
        return error;
    }
    if (!NoteRead) {
        return null;
    }
    return NoteRead;
};
