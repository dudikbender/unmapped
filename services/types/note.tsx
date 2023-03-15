export type Note = {
    id?: number;
    latitude: number;
    longitude: number;
    content: string;
    uuid: string;
    user_id: string;
    reply_to_note?: string | null;
    to_user_id?: string | null;
};

export type ReplyNote = {
    id?: number;
    latitude: number;
    longitude: number;
    content: string;
    uuid: string;
    user_id: string;
    reply_to_note: string;
    to_user_id: string | null;
};
