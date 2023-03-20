import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addNote = async (
    noteData: Note
): Promise<any | PostgrestError> => {
    const { data: Note, error } = await supabase
        .from("Notes")
        .insert(noteData)
        .select("*");
    if (error) {
        console.log(error);
        return error;
    }
    return Note;
};
