import { useState, useEffect } from "react";
import { User } from "@/services/types/user";
import { searchUsers } from "@/services/users/searchUsers";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export const SearchUsersInput = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const listResults = async () => {
        setSearching(true);
        const response = await searchUsers(searchTerm);
        setSearchResults(response);
        setSearching(false);
    };
    console.log("Results: ", searchResults);
    useEffect(() => {
        console.log("Search term changed: ", searchTerm.length, searchTerm);
        if (searchTerm.length === 0) {
            setSearchResults([]);
        }
        if (searchTerm.length > 2) {
            setTimeout(() => {
                listResults();
            }, 500);
        }
    }, [searchTerm]);

    console.log("Query length: ", searchTerm.length);
    return (
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
                                className="flex p-1 cursor-pointer items-center rounded-md 
                                            hover:bg-blue-400 hover:text-white hover:ring-1 hover:ring-blue-500 hover:ring-opacity-50"
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
    );
};
