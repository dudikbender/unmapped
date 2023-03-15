export type Note = {
    id?: number;
    latitude: number;
    longitude: number;
    content: string;
    uuid: string;
    user_id: string;
    reply_to_note_id?: number | null;
    to_user_id?: string | null;
};
