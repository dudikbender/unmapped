import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/services/types/supabase";

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const addBlock = async (
    user_id: string,
    user_to_block: string,
    comment?: string
): Promise<any | PostgrestError | null> => {
    const blockData = {
        user_id: user_id,
        blocked_user_id: user_to_block,
        blocked: true,
        comment: comment,
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString()
    };
    const { data: BlockItem, error } = await supabase
        .from("BlockList")
        .insert(blockData);
    if (error) {
        console.log(error);
        return error;
    }
    if (!BlockItem) {
        return null;
    }
    return BlockItem;
};

export const unBlock = async (
    blockUUID: string,
    comment?: string
): Promise<any | PostgrestError | null> => {
    type BlockData = {
        blocked: boolean;
        last_updated: string;
        comment?: string;
    };
    var blockData: BlockData = {
        blocked: false,
        last_updated: new Date().toISOString()
    };
    // If comment is provided, add it to the blockData object
    if (comment) {
        blockData = {
            ...blockData,
            comment: comment
        };
    }
    const { data: BlockItem, error } = await supabase
        .from("BlockList")
        .update(blockData)
        .eq("uuid", blockUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!BlockItem || !blockUUID) {
        return null;
    }
    return BlockItem;
};

export const reBlock = async (
    blockUUID: string,
    comment?: string
): Promise<any | PostgrestError | null> => {
    type BlockData = {
        blocked: boolean;
        last_updated: string;
        comment?: string;
    };
    var blockData: BlockData = {
        blocked: true,
        last_updated: new Date().toISOString()
    };
    // If comment is provided, add it to the blockData object
    if (comment) {
        blockData = {
            ...blockData,
            comment: comment
        };
    }
    const { data: BlockItem, error } = await supabase
        .from("BlockList")
        .update(blockData)
        .eq("uuid", blockUUID);
    if (error) {
        console.log(error);
        return error;
    }
    if (!BlockItem || !blockUUID) {
        return null;
    }
    return BlockItem;
};
