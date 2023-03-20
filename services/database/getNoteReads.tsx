import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { NoteRead } from "../types/note";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getNoteReads = async (
    userId: string | undefined,
    dateTimeCutOff: string | undefined,
    rangeStart: number = 0,
    rangeEnd: number = 100
): Promise<{ userNoteReads: NoteRead[]; count: number | null } | undefined> => {
    if (!userId) {
        return;
    }
    // Convert the dateTimeCutoff to a Date object, default to Jan 1, 2023
    let afterDate = new Date("2023-01-01").toISOString();
    if (dateTimeCutOff) {
        afterDate = dateTimeCutOff;
    }
    const {
        data: noteReads,
        count,
        error
    } = await supabase
        .from("NoteReads")
        .select("*", { count: "exact" })
        .range(rangeStart, rangeEnd)
        .eq("user_id", userId)
        .gte("created_at", afterDate)
        .order("created_at", { ascending: false });
    if (error) {
        console.log(error);
        return undefined;
    }
    console.log(noteReads);
    return { userNoteReads: noteReads, count: count };
};
