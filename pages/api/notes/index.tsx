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
    let { data: Notes, error } = await supabase.from("Notes").select();
    if (error) {
        return res.status(500).json(error);
    }
    return res.status(200).json(Notes);
}
