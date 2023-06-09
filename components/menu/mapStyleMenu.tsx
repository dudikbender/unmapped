import { FC, useEffect, useState } from "react";
import {
    Bars3Icon,
    XMarkIcon,
    GlobeAltIcon
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { MapStyle } from "@/services/types/mapObjects";

type Props = {
    openMenu: string | null | undefined;
    handleSelection: () => void;
    handleStyleSelection: (style: MapStyle) => void;
};

type MenuItem = {
    text: string;
    style: MapStyle;
};

const styleOptions: Record<string, MenuItem> = {
    satellite: {
        text: "satellite",
        style: MapStyle.SATELLITE
    },
    streets: {
        text: "streets",
        style: MapStyle.STREETS
    },
    light: {
        text: "light",
        style: MapStyle.LIGHT
    },
    dark: {
        text: "dark",
        style: MapStyle.DARK
    },
    satelliteStreets: {
        text: "satellite streets",
        style: MapStyle.SATELLITESTREETS
    }
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const MapStyleMenu: FC<Props> = ({
    openMenu,
    handleSelection,
    handleStyleSelection
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [style, setStyle] = useState<MapStyle>(MapStyle.LIGHT);

    useEffect(() => {
        setMenuOpen(openMenu === "style" ? true : false);
    }, [openMenu]);

    return (
        <>
            <div
                className={classNames(
                    menuOpen
                        ? "bg-blue-100 italic"
                        : "bg-white hover:bg-blue-400 hover:text-white",
                    "rounded-md m-auto p-2 cursor-default text-lg hover:cursor-pointer"
                )}
                onClick={() => {
                    setMenuOpen(!menuOpen);
                    handleSelection;
                }}
            >
                {!menuOpen ? (
                    <GlobeAltIcon className="h-6 w-6" />
                ) : (
                    <XMarkIcon className="h-6 w-6" />
                )}
            </div>
            <div>
                {menuOpen && (
                    <div className="absolute flex flex-col -right-4 top-16 w-100 transition ease-in-out delay-150">
                        {Object.keys(styleOptions).map((key) => (
                            <div
                                key={key}
                                className={classNames(
                                    styleOptions[key].style === style
                                        ? "bg-blue-400 text-white"
                                        : "bg-white",
                                    "z-10 rounded-md w-24 p-2 my-1 mr-4 cursor-default text-md hover:bg-blue-400 hover:text-white hover:cursor-pointer shadow-lg"
                                )}
                                onClick={() => {
                                    setStyle(styleOptions[key].style);
                                    handleStyleSelection(
                                        styleOptions[key].style
                                    );
                                }}
                            >
                                <p>{styleOptions[key].text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
