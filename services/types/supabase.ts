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
            Connections: {
                Row: {
                    accepted: boolean | null;
                    accepted_date: string | null;
                    blocked: boolean | null;
                    blocked_date: string | null;
                    created_at: string | null;
                    id: number;
                    requested_user: string;
                    requester_user: string;
                    uuid: string;
                };
                Insert: {
                    accepted?: boolean | null;
                    accepted_date?: string | null;
                    blocked?: boolean | null;
                    blocked_date?: string | null;
                    created_at?: string | null;
                    id?: number;
                    requested_user: string;
                    requester_user: string;
                    uuid?: string;
                };
                Update: {
                    accepted?: boolean | null;
                    accepted_date?: string | null;
                    blocked?: boolean | null;
                    blocked_date?: string | null;
                    created_at?: string | null;
                    id?: number;
                    requested_user?: string;
                    requester_user?: string;
                    uuid?: string;
                };
            };
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
                    uuid: string | null;
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
                    uuid?: string | null;
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
                    uuid?: string | null;
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
