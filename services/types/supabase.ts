export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            NoteReads: {
                Row: {
                    created_at: string | null;
                    id: number;
                    last_read: string | null;
                    note_id: number;
                    starred: boolean | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: number;
                    last_read?: string | null;
                    note_id: number;
                    starred?: boolean | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: number;
                    last_read?: string | null;
                    note_id?: number;
                    starred?: boolean | null;
                    user_id?: string;
                };
            };
            Notes: {
                Row: {
                    content: string;
                    created_at: string;
                    id: number;
                    latitude: number;
                    longitude: number;
                    reply_to_note: string | null;
                    to_user_id: string | null;
                    user_id: string;
                    uuid: string;
                };
                Insert: {
                    content: string;
                    created_at?: string;
                    id?: number;
                    latitude: number;
                    longitude: number;
                    reply_to_note?: string | null;
                    to_user_id?: string | null;
                    user_id: string;
                    uuid?: string;
                };
                Update: {
                    content?: string;
                    created_at?: string;
                    id?: number;
                    latitude?: number;
                    longitude?: number;
                    reply_to_note?: string | null;
                    to_user_id?: string | null;
                    user_id?: string;
                    uuid?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
