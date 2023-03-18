import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/services/types/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;
    const response = fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CLERK_SECRET_KEY}`
        }
    }).then((res) => res.json());
    const data = await response;
    // Return only the data we need for each user
    const user: User = {
        uuid: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name} ${data.last_name}`,
        profileImageUrl: data.profile_image_url
    };
    return res.status(200).json(user);
}
