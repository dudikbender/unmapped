import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const updateNoteContent = async (
    newContent: string | undefined,
    noteUUID: string | undefined
): Promise<any | PostgrestError> => {
    if (newContent === undefined || noteUUID === undefined) {
        return;
    }
    const { data: UpdatedNote, error } = await supabase
        .from("Notes")
        .update({ content: newContent })
        .eq("uuid", noteUUID);
    if (error) {
        console.log(error);
        return error;
    }
    return UpdatedNote;
};

export const updateNoteCoordinates = async (
    newLatitude: number | undefined,
    newLongitude: number | undefined,
    noteUUID: string
): Promise<any | PostgrestError> => {
    if (newLatitude === undefined || newLongitude === undefined) {
        return;
    }
    const { data: UpdatedNote, error } = await supabase
        .from("Notes")
        .update({ latitude: newLatitude, longitude: newLongitude })
        .eq("uuid", noteUUID);
    if (error) {
        console.log(error);
        return error;
    }
    return UpdatedNote;
};
