import { useState } from "react";

type MenuItem = {
    text: string;
    icon: string;
    link: string;
};

export const menuItems = {
    notes: {
        text: "notes",
        icon: "notes",
        link: "/notes"
    },
    about: {
        text: "about",
        icon: "about",
        link: "/about"
    },
    share: {
        text: "share",
        icon: "share",
        link: "/share"
    }
};

export const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <div
                className="rounded-md bg-white m-auto p-2 ml-2 cursor-default text-lg 
                    hover:bg-gray-400 hover:text-white hover:cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                menu
            </div>
            <div>
                {menuOpen && (
                    <div className="absolute flex flex-col left-0 top-16 justify-items-center">
                        {Object.keys(menuItems).map((key) => (
                            <div
                                key={key}
                                className="rounded-md bg-white m-auto p-2 my-1 ml-2 cursor-default text-lg
                                        hover:bg-gray-400 hover:text-white hover:cursor-pointer"
                            >
                                {menuItems[key].text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
