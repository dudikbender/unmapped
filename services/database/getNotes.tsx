import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { Note } from "../types/note";
import { PostgrestError } from "@supabase/supabase-js";
import { FC } from "react";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getNotes = async (
    userId: string | undefined,
    rangeStart: number = 0,
    rangeEnd: number = 100
): Promise<{ userNotes: Note[]; count: number | null } | undefined> => {
    if (!userId) {
        return;
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
        .order("created_at", { ascending: false });
    if (error) {
        console.log(error);
        return undefined;
    }
    return { userNotes: userNotes, count: count };
};
