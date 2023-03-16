import { Fragment, useEffect, useState, FC } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { UserConnection } from "@/services/types/connections";
import { useConnectionStore } from "@/services/stores/connectionStore";

type Props = {
    handleSelection: (selected: UserConnection | null) => void;
};

export const ConnectionsLookup: FC<Props> = ({ handleSelection }) => {
    const [selected, setSelected] = useState<UserConnection | null>(null);
    const [query, setQuery] = useState<string>("");
    const { connections } = useConnectionStore();

    useEffect(() => {
        handleSelection(selected);
    }, [selected]);

    const filteredOptions =
        query === ""
            ? connections
            : connections.filter((connection: UserConnection) =>
                  connection?.fullName
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    return (
        <div>
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1 bg-white">
                    <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left shadow-md border-2 border-blue-200 bg-white">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:ring-offset-0 focus:outline-none bg-white"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(connection: UserConnection) =>
                                connection?.fullName
                            }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto py-1 text-base shadow-lg sm:text-sm z-10
                        border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        >
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOptions.map(
                                    (option: UserConnection) => (
                                        <Combobox.Option
                                            key={option.uuid}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-blue-400 text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {option.fullName}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                active
                                                                    ? "text-white"
                                                                    : "text-blue-400"
                                                            }`}
                                                        >
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    )
                                )
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
};
