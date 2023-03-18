import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note, NoteRead } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getUserNoteReads = async (userId: string) => {
    const {
        data: noteReads,
        count,
        error
    } = await supabase
        .from("NoteReads")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .limit(100);
    if (error) {
        return error;
    }
    return { noteReads, count };
};

export const getNoteRead = async (
    noteId: string
): Promise<any | PostgrestError> => {
    const { data: noteRead, error } = await supabase
        .from("NoteReads")
        .select()
        .eq("note_id", noteId);
    if (error) {
        console.log(error);
        return error;
    }
    return noteRead;
};

export const addNoteRead = async (
    noteData: NoteRead
): Promise<any | PostgrestError> => {
    const { data: noteRead, error } = await supabase
        .from("NoteReads")
        .insert(noteData);
    if (error) {
        console.log(error);
        return error;
    }
    return noteRead;
};
