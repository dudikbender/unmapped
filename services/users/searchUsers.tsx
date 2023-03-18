export const searchUsers = async (searchInput: string | undefined) => {
    const request = await fetch(`/api/users/search?q=${searchInput}`)
        .then((res) => res.json())
        .then((data) => data);
    return request;
};
