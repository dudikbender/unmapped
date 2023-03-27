import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addFeedback = async (
    userId: string,
    content: string,
    userEmail: string
): Promise<any | PostgrestError | null> => {
    const { data, status, error } = await supabase.from("Feedback").insert({
        user_id: userId,
        content: content,
        user_email: userEmail
    });
    if (error) {
        console.log(error);
        return error;
    }
    console.log("Backed Data: ", data);
    return status;
};
