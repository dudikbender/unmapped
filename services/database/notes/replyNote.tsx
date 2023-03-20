import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { ReplyNote } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const replyNote = async (
    noteReply: ReplyNote
): Promise<any | PostgrestError> => {
    const { data: Notes, error } = await supabase
        .from("Notes")
        .insert(noteReply);
    if (error) {
        console.log(error);
        return error;
    }
    return Notes;
};
