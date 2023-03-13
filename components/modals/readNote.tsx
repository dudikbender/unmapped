import React, { FC, Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Note } from "@/services/types/note";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
    show: boolean;
    note: Note | null;
    handleClose: () => void;
};

export const ReadNoteModal: FC<Props> = ({ show, note, handleClose }) => {
    const [showModal, setShowModal] = useState(show);

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
                                                <button
                                                    onClick={() =>
                                                        setShowModal(false)
                                                    }
                                                    className="text-black text-xl text-bold place-self-end hover:text-gray-400"
                                                >
                                                    <span>
                                                        <XMarkIcon className="h-6 w-6" />
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div>
                                                    <label
                                                        htmlFor="about"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {note?.latitude} ,{" "}
                                                        {note?.longitude}
                                                    </label>
                                                    <div className="mt-1">
                                                        <textarea
                                                            id="note-content"
                                                            name="note-content"
                                                            disabled={true}
                                                            rows={5}
                                                            className="shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            defaultValue={
                                                                note?.content
                                                            }
                                                        />
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
