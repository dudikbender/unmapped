export const getUser = async (userId: string | undefined) => {
    const request = await fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => data);
    return request;
};

export const getUserList = async (userIds: Array<string>) => {
    const request = await fetch(
        `/api/users?limit=10&order_by=newest&user_ids=${userIds}`
    )
        .then((res) => res.json())
        .then((data) => data);
    return request;
};
