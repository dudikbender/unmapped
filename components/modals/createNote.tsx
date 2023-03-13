import React, { FC, Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useNoteStore } from "@/services/stores/noteStore";
import { v4 as uuidv4 } from "uuid";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
    show: boolean;
    coordinates: { lat: number; lng: number } | null;
    handleClose: () => void;
};

export const CreateNoteModal: FC<Props> = ({
    show,
    coordinates,
    handleClose
}) => {
    const [showModal, setShowModal] = useState(show);
    const [noteContent, setNoteContent] = useState("");
    const { addNote } = useNoteStore();

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        if (!showModal) {
            setTimeout(handleClose, 300);
        }
    }, [showModal]);

    if (!show) {
        return null;
    }

    return (
        <Transition.Root appear show={showModal} as={Fragment}>
            <Dialog
                as="div"
                open={show}
                className="relative z-40"
                onClose={() => setShowModal(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-700"
                                enterFrom="translate-x-full opacity-0"
                                enterTo="translate-x-0 opacity-100"
                                leave="transition ease-in-out duration-500 transform"
                                leaveFrom="translate-x-0 opacity-100"
                                leaveTo="translate-x-full opacity-0"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl lg:max-w-2xl">
                                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="flex relative min-h-0 flex-1 flex-col overflow-y-scroll py-6 ">
                                            <div className="flex absolute top-6 right-6 items-center">
                                                <Dialog.Title className="text-md text-gray-900 font-serif pr-10"></Dialog.Title>
                                                <button
                                                    onClick={() =>
                                                        setShowModal(false)
                                                    }
                                                    className="text-black text-xl text-bold place-self-end hover:text-blue-500"
                                                >
                                                    <span>
                                                        <XMarkIcon className="h-6 w-6" />
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div>
                                                    <div>
                                                        <label
                                                            htmlFor="coordinates"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            {coordinates?.lat} ,{" "}
                                                            {coordinates?.lng}
                                                        </label>
                                                        <div className="mt-1">
                                                            <textarea
                                                                id="note-content"
                                                                name="note-content"
                                                                rows={5}
                                                                className="shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-blue-300 rounded-md"
                                                                defaultValue={
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setNoteContent(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                console.log(
                                                                    noteContent
                                                                );
                                                                addNote({
                                                                    id: uuidv4(),
                                                                    content:
                                                                        noteContent,
                                                                    latitude:
                                                                        coordinates?.lat,
                                                                    longitude:
                                                                        coordinates?.lng,
                                                                    date: new Date(),
                                                                    user: "test",
                                                                    opened: false
                                                                });
                                                                setShowModal(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            Drop note
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
