export type Connection = {
    id?: number;
    uuid: string;
    requester_user: string;
    requested_user: string;
    accepted?: boolean;
    accepted_date?: string;
    blocked?: boolean;
    blocked_date?: string;
    created_at?: string;
};
