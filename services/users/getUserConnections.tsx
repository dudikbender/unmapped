import { getConnections } from "../database/getConnections";
import { getUserList } from "@/services/users/getUser";
import { UserConnection } from "../types/connections";

export const getUserConnections = async (
    userId: string | undefined
): Promise<UserConnection[] | undefined> => {
    if (!userId) {
        return;
    }
    const connections = await getConnections(userId);
    if (connections === null) {
        return;
    }
    const connectionList = connections.map((connection: any) => {
        const connectionData = {
            id: connection.id,
            userId: null,
            uuid: connection.uuid,
            accepted: connection.accepted,
            acceptedDate: connection.accepted_date,
            createdAt: connection.created_at
        };
        if (connection.requester_user === userId) {
            connectionData["userId"] = connection.requested_user;
            return connectionData;
        } else {
            connectionData["userId"] = connection.requester_user;
            return connectionData;
        }
    });
    const userList = await getUserList(
        connectionList.map((connection: any) => connection.userId)
    );
    const filteredUserList = userList.map((user: any) => {
        return {
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: `${user.first_name} ${user.last_name}`,
            profileImageUrl: user.profile_image_url,
            id: user.id
        };
    });
    const combinedConnectionData = connectionList.map((connection: any) => {
        const user = filteredUserList.find(
            (user: any) => user.id === connection.userId
        );
        delete user.id;
        return {
            ...connection,
            ...user
        };
    });
    return combinedConnectionData;
};
