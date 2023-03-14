export const getUser = async (userId: string | undefined) => {
    const request = await fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => data);
    return request;
};
