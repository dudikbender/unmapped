import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

type MenuItem = {
    text: string;
    icon: string;
    link: string;
};

export const menuItems: Record<string, MenuItem> = {
    notes: {
        text: "notes",
        icon: "notes",
        link: "/notes"
    },
    share: {
        text: "share",
        icon: "share",
        link: "/share"
    },
    profile: {
        text: "profile",
        icon: "profile",
        link: "/profile"
    }
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <div
                className={classNames(
                    menuOpen
                        ? "bg-gray-200 italic"
                        : "bg-white hover:bg-gray-400 hover:text-white",
                    "rounded-md m-auto p-2 cursor-default text-lg hover:cursor-pointer"
                )}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {!menuOpen ? (
                    <Bars3Icon className="h-6 w-6" />
                ) : (
                    <XMarkIcon className="h-6 w-6" />
                )}
            </div>
            <div>
                {menuOpen && (
                    <div className="absolute flex flex-col -right-4 top-16 w-100">
                        {Object.keys(menuItems).map((key) => (
                            <div
                                key={key}
                                className="rounded-md bg-white w-100 p-2 my-1 mr-4 cursor-default text-lg
                                        hover:bg-gray-400 hover:text-white hover:cursor-pointer"
                            >
                                <Link href={menuItems[key].link}>
                                    {menuItems[key].text}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
