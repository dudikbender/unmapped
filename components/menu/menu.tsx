import { useState, FC, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { NotesList } from "./notes/notesModal";
import { ConnectionsModal } from "./connections/connectionsModal";
import { SearchConnectionModal } from "./connections/searchUsersModal";
import { ShareModal } from "./share/shareModal";
import { FeedbackModal } from "./feedback/feedbackModal";

type MenuItem = {
    text: string;
    icon: string;
    activation: string;
};

type Props = {
    openMenu: string | null | undefined;
    handleSelection: () => void;
};

export const menuItems: Record<string, MenuItem> = {
    notes: {
        text: "notes",
        icon: "notes",
        activation: "notes"
    },
    connections: {
        text: "connections",
        icon: "connections",
        activation: "connections"
    },
    share: {
        text: "share",
        icon: "share",
        activation: "share"
    },
    feedback: {
        text: "feedback",
        icon: "feedback",
        activation: "feedback"
    },
    profile: {
        text: "settings",
        icon: "settings",
        activation: "settings"
    }
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const Menu: FC<Props> = ({ openMenu, handleSelection }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [secondaryMenu, setSecondaryMenu] = useState<string>("");

    useEffect(() => {
        setMenuOpen(openMenu === "main" ? true : false);
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
                    setMenuOpen(!menuOpen);
                    handleSelection();
                }}
            >
                {!menuOpen ? (
                    <Bars3Icon className="h-6 w-6" />
                ) : (
                    <XMarkIcon className="h-6 w-6" />
                )}
            </div>
            <div>
                {menuOpen && (
                    <div className="z-10 absolute flex flex-col -right-4 top-14 w-100 transition ease-in-out delay-150">
                        {Object.keys(menuItems).map((key) => (
                            <div
                                key={key}
                                className="rounded-md bg-white w-100 p-2 my-1 mr-4 cursor-default text-md
                                        hover:bg-blue-400 hover:text-white hover:cursor-pointer shadow-lg"
                                onClick={() => {
                                    setMenuOpen(false);
                                    setSecondaryMenu(menuItems[key].activation);
                                }}
                            >
                                <p>{menuItems[key].text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <NotesList
                    show={secondaryMenu === "notes"}
                    handleClose={() => setSecondaryMenu("")}
                />
            </div>
            <div>
                <ConnectionsModal
                    show={secondaryMenu === "connections"}
                    handleClose={() => {
                        setSecondaryMenu("");
                    }}
                    handleAddConnection={() => {
                        setSecondaryMenu("");
                        setSecondaryMenu("add-connection");
                    }}
                />
            </div>
            <div>
                <SearchConnectionModal
                    show={secondaryMenu === "add-connection"}
                    handleClose={() => setSecondaryMenu("")}
                />
            </div>
            <div>
                <FeedbackModal
                    show={secondaryMenu === "feedback"}
                    handleClose={() => setSecondaryMenu("")}
                />
            </div>
            <div>
                <ShareModal
                    show={secondaryMenu === "share"}
                    handleClose={() => setSecondaryMenu("")}
                />
            </div>
        </>
    );
};
