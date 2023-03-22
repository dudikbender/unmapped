import { useState, FC, useEffect } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { SearchConnectionModal } from "./connections/searchUsersModal";

type MenuItem = {
    text: string;
    icon: string;
    activation: string;
};

type Props = {
    openMenu: string | null | undefined;
    handleSelection: () => void;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const QuickAddMenu: FC<Props> = ({ openMenu, handleSelection }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(openMenu === "add-connection" ? true : false);
    }, [openMenu]);

    return (
        <>
            <div
                className={classNames(
                    menuOpen
                        ? "bg-blue-100 italic"
                        : "bg-white hover:bg-blue-400 hover:text-white",
                    "rounded-md p-2 cursor-default text-md hover:cursor-pointer"
                )}
                onClick={() => {
                    setMenuOpen(menuOpen);
                    handleSelection();
                }}
            >
                <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
                <SearchConnectionModal
                    show={menuOpen}
                    handleClose={() => setMenuOpen(false)}
                />
            </div>
        </>
    );
};
