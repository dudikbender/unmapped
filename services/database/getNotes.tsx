import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "@/services/types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getNotes = async () => {
    const { data: Notes, error } = await supabase.from("Notes").select();
    if (error) {
        return error;
    }
    return Notes;
};
