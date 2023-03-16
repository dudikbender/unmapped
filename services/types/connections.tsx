export type DatabaseConnection = {
    id?: number;
    uuid: string;
    requester_user: string;
    requested_user: string;
    accepted?: boolean;
    accepted_date?: string;
    created_at?: string;
};

export type UserConnection = {
    id?: number;
    userId?: string;
    uuid: string;
    accepted?: boolean;
    acceptedDate?: string;
    createdAt?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
    fullName: string;
};
