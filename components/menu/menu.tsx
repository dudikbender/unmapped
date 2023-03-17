import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { NotesList } from "./notes/notesModal";
import { ConnectionsModal } from "./connections/connectionsModal";
import { ShareModal } from "./share/shareModal";

type MenuItem = {
    text: string;
    icon: string;
    activation: string;
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
    profile: {
        text: "settings",
        icon: "settings",
        activation: "settings"
    }
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [secondaryMenu, setSecondaryMenu] = useState<string>("");
    return (
        <>
            <div
                className={classNames(
                    menuOpen
                        ? "bg-blue-100 italic"
                        : "bg-white hover:bg-blue-400 hover:text-white",
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
                    <div className="absolute flex flex-col -right-4 top-16 w-100 transition ease-in-out delay-150">
                        {Object.keys(menuItems).map((key) => (
                            <div
                                key={key}
                                className="rounded-md bg-white w-100 p-2 my-1 mr-4 cursor-default text-lg
                                        hover:bg-blue-400 hover:text-white hover:cursor-pointer"
                            >
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setSecondaryMenu(
                                            menuItems[key].activation
                                        );
                                    }}
                                >
                                    {menuItems[key].text}
                                </button>
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
