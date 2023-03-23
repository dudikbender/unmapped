export type DatabaseConnection = {
    accepted: boolean | null;
    accepted_date: string | null;
    created_at: string | null;
    id: number;
    requested_user: string;
    requester_user: string;
    uuid: string;
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
    requesterUser?: string;
};
