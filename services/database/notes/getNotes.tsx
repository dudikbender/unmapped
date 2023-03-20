import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "../../types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getFullNote = async (
    noteUUID: string
): Promise<Note | undefined> => {
    const { data: noteData, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", noteUUID)
        .single();
    if (error) {
        console.log(error);
        return;
    }
    return noteData;
};

export const getNotes = async (
    userId: string | undefined,
    dateTimeCutOff: string | undefined = undefined,
    rangeStart: number = 0,
    rangeEnd: number = 100
): Promise<{ userNotes: Note[]; count: number | null } | undefined> => {
    if (!userId) {
        return;
    }
    // Convert the dateTimeCutoff to a Date object, default to Jan 1, 2023
    let afterDate = new Date("2023-01-01").toISOString();
    if (dateTimeCutOff) {
        afterDate = dateTimeCutOff;
    }
    const {
        data: userNotes,
        count,
        error
    } = await supabase
        .from("Notes")
        .select("*", { count: "exact" })
        .range(rangeStart, rangeEnd)
        .or(`user_id.eq.${userId},to_user_id.eq.${userId}`)
        .gte("created_at", afterDate)
        .order("created_at", { ascending: false });
    if (error) {
        console.log(error);
        return undefined;
    }
    return { userNotes: userNotes, count: count };
};
