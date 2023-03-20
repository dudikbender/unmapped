export type DatabaseConnection = {
    id?: number;
    uuid: string;
    requester_user: string;
    requested_user: string;
    accepted?: boolean | null;
    accepted_date?: string | null;
    created_at?: string | null;
};

export type UserConnection = {
    id?: number;
    userId?: string;
    uuid: string;
    accepted?: boolean | null;
    acceptedDate?: string | null;
    createdAt?: string | null;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    fullName: string;
};
