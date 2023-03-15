import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const noteRead = async (noteId: Note): Promise<any | PostgrestError> => {
    const { data: NoteRead, error } = await supabase
        .from("NoteReads")
        .select()
        .eq("note_id", noteId);
    if (error) {
        console.log(error);
        return error;
    }
    return NoteRead;
};

export const addNoteRead = async (
    noteData: Note
): Promise<any | PostgrestError> => {
    const { data: Notes, error } = await supabase
        .from("Notes")
        .insert(noteData);
    if (error) {
        console.log(error);
        return error;
    }
    return Notes;
};
