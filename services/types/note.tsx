export type Note = {
    id?: number;
    created_at?: string;
    latitude: number;
    longitude: number;
    content: string;
    uuid: string | null;
    user_id: string;
    reply_to_note?: string | null;
    to_user_id?: string | null;
    read?: boolean;
    last_read?: string | null | undefined;
    starred?: boolean;
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

export type NoteRead = {
    id?: number;
    note_id: string;
    user_id: string;
    created_at?: string | null;
    starred?: boolean | null | undefined;
    last_read?: string | null;
};
