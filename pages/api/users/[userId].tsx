import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    const response = fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
        }
    }).then((res) => res.json());
    const data = await response;
    return res.status(200).json(data);
}
