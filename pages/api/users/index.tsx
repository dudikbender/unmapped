import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    // Get query params
    const { limit, order_by, user_ids } = req.query;
    let userIDsString = "";
    // Convert user_ids from comma separated string into array
    const userIdArray = user_ids?.toString().split(",");
    if (!userIdArray) {
        return res.status(400).json({ message: "Bad request" });
    }
    userIdArray.forEach((id: string) => {
        userIDsString += `user_id=${id}&`;
    });
    const response = fetch(
        `https://api.clerk.dev/v1/users?limit=${limit}&order_by=${
            order_by === "newest" ? "-created_at" : "created_at"
        }&${userIDsString}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`
            }
        }
    ).then((res) => res.json());
    const data = await response;
    return res.status(200).json(data);
}
