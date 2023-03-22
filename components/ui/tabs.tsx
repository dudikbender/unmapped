import { FC, useEffect, useState } from "react";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export type Tab = {
    name: any;
    current: boolean;
};

type Props = {
    tabs: Tab[];
    initialSelected: string;
    onChange: (e: any) => void;
};

export const MenuTabs: FC<Props> = ({ tabs, initialSelected, onChange }) => {
    const [selected, setSelected] = useState(initialSelected);
    useEffect(() => {
        onChange(selected);
    }, [selected]);

    // Tab menu that modifies depending on screen size, and number of tabs
    if (tabs.length > 2) {
        return (
            <div>
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        defaultValue={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav
                        className="isolate flex divide-x divide-gray-200 rounded-md shadow"
                        aria-label="Tabs"
                    >
                        {tabs.map((tab, tabIdx) => (
                            <span
                                key={tab.name}
                                className={classNames(
                                    tab.name === selected
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-700",
                                    tabIdx === 0 ? "rounded-l-md" : "",
                                    tabIdx === tabs.length - 1
                                        ? "rounded-r-md"
                                        : "",
                                    "group relative min-w-0 flex-1 overflow-hidden bg-white p-2 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 cursor-pointer"
                                )}
                                aria-current={
                                    tab.current ? tab.name : undefined
                                }
                                onClick={() => setSelected(tab.name)}
                            >
                                <span>{tab.name}</span>
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        tab.current
                                            ? "bg-blue-500"
                                            : "bg-transparent",
                                        "absolute inset-x-0 bottom-0 h-0.5"
                                    )}
                                />
                            </span>
                        ))}
                    </nav>
                </div>
            </div>
        );
    }

    // If two tabs then skip the dropdown menu
    return (
        <div>
            <div className="block">
                <nav
                    className="isolate flex divide-x divide-gray-200 rounded-md shadow"
                    aria-label="Tabs"
                >
                    {tabs.map((tab, tabIdx) => (
                        <span
                            key={tab.name}
                            className={classNames(
                                tab.name === selected
                                    ? "text-gray-900"
                                    : "text-gray-500 hover:text-gray-700",
                                tabIdx === 0 ? "rounded-l-md" : "",
                                tabIdx === tabs.length - 1
                                    ? "rounded-r-md"
                                    : "",
                                "group relative min-w-0 flex-1 overflow-hidden bg-white p-2 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 cursor-pointer"
                            )}
                            aria-current={tab.current ? tab.name : undefined}
                            onClick={() => setSelected(tab.name)}
                        >
                            <span>{tab.name}</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    tab.current
                                        ? "bg-blue-500"
                                        : "bg-transparent",
                                    "absolute inset-x-0 bottom-0 h-0.5"
                                )}
                            />
                        </span>
                    ))}
                </nav>
            </div>
        </div>
    );
};
