import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/services/types/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    // Get query params
    const { q } = req.query;
    const response = fetch(
        `https://api.clerk.dev/v1/users?query=${q}&limit=5&offset=0&order_by=-created_at`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`
            }
        }
    ).then((res) => res.json());
    const data = await response;
    // Return each user with only the data we need
    const userList: User[] = [];
    data.forEach((user: any) => {
        const userObject: User = {
            uuid: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: `${user.first_name} ${user.last_name}`,
            profileImageUrl: user.profile_image_url
        };
        userList.push(userObject);
    });
    return res.status(200).json(userList);
}
