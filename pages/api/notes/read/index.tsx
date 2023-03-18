import { createClient } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { noteId } = req.query;
    let { data: Note, error } = await supabase
        .from("NoteReads")
        .select("*")
        .eq("note_id", `${noteId}`)
        .single();
    if (error) {
        console.log(error);
        return res.status(500).json(error);
    }
    console.log(Note);
    return res.status(200).json(Note);
}
