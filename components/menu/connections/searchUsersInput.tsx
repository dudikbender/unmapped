import { useState, useEffect, FC } from "react";
import { useUser } from "@clerk/nextjs";
import { User } from "@/services/types/user";
import { searchUsers } from "@/services/users/searchUsers";
import Image from "next/image";

type Props = {
    handleSelection: (user: User) => void;
};

export const SearchUsersInput: FC<Props> = ({ handleSelection }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(
        undefined
    );
    const { user: currentUser } = useUser();
    console.log(currentUser);
    console.log(searchResults);
    const listResults = async () => {
        setSearching(true);
        const response = await searchUsers(searchTerm);
        const filteredResults = response.filter(
            (user: User) => user.uuid !== currentUser?.id
        );
        setSearchResults(filteredResults);
        setSearching(false);
    };
    useEffect(() => {
        if (searchTerm.length === 0) {
            setSearchResults([]);
        }
        if (searchTerm.length > 2) {
            listResults();
        }
    }, [searchTerm]);

    useEffect(() => {
        if (selectedUser) {
            handleSelection(selectedUser);
        }
    }, [selectedUser]);
    return (
        <>
            <div>
                <div className="flex items-center justify-between border-2 border-blue-200 rounded-md">
                    <input
                        type="text"
                        className="p-1 focus:outline-blue-500 w-full focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search for users"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    {searching && (
                        <span className="p-1 font-semibold text-sm outline-none">
                            Searching...
                        </span>
                    )}
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <ul>
                            {searchResults.map((user) => (
                                <div
                                    key={user.uuid}
                                    className="flex p-2 cursor-pointer items-center rounded-md hover:bg-blue-400 hover:text-white hover:ring-1 hover:ring-blue-500 hover:ring-opacity-50"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <div className="relative h-[30px] w-[30px]">
                                        <Image
                                            className="rounded-full object-cover hover:border hover:border-white"
                                            src={
                                                user?.profileImageUrl ??
                                                "/placeholder-author.png"
                                            }
                                            alt="Connection Image"
                                            fill={true}
                                        />
                                    </div>
                                    <li className="ml-4">{user.fullName}</li>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};
