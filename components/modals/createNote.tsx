import React, { FC, Fragment, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Transition, Dialog } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addNote } from "@/services/database/addNote";
import { useNoteStore } from "@/services/stores/noteStore";
import { ConnectionsLookup } from "./connectionsLookup";

type Props = {
    show: boolean;
    coordinates: { lat: number; lng: number };
    handleClose: () => void;
};

export const CreateNoteModal: FC<Props> = ({
    show,
    coordinates,
    handleClose
}) => {
    const [showModal, setShowModal] = useState(show);
    const [noteReceipient, setNoteReceipient] = useState<string | undefined>(
        ""
    );
    const [noteContent, setNoteContent] = useState("");
    const { user } = useUser();
    const { addNoteToStore } = useNoteStore();
    const userId = user ? user.id : "";

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        if (!showModal) {
            setTimeout(handleClose, 300);
        }
    }, [showModal]);

    const handleAddNote = async () => {
        if (!noteContent || !coordinates) {
            alert("Add content to drop note...");
            return;
        }

        if (!noteReceipient) {
            alert("Select a user to drop note to...");
            return;
        }

        const note = {
            uuid: uuidv4(),
            latitude: coordinates?.lat,
            longitude: coordinates?.lng,
            content: noteContent,
            user_id: userId,
            to_user_id: noteReceipient
        };

        try {
            const newNote = await addNote(note);
            addNoteToStore({
                uuid: note.uuid,
                latitude: note.latitude,
                longitude: note.longitude,
                content: note.content,
                user_id: note.user_id,
                to_user_id: note.to_user_id
            });
            setShowModal(false);
        } catch (error) {
            console.log(error);
        }
    };

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
                                leaveFrom="translate-y-0 opacity-100"
                                leaveTo="translate-y-full opacity-0"
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
                                                        <h1 className="mt-2 text-gray-900">
                                                            To:
                                                        </h1>
                                                        <div>
                                                            <ConnectionsLookup
                                                                handleSelection={(
                                                                    e
                                                                ) =>
                                                                    setNoteReceipient(
                                                                        e?.userId
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="mt-4">
                                                            <textarea
                                                                id="note-content"
                                                                name="note-content"
                                                                rows={5}
                                                                className="shadow-sm p-2 border-2 border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full 
                                                                            sm:text-sm rounded-md focus:outline-none"
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
                                                        <div className="mt-4">
                                                            <button
                                                                className="p-2 text-gray-900 border-2 border-gray-200 rounded-lg hover:bg-blue-500 hover:text-white"
                                                                onClick={() => {
                                                                    handleAddNote();
                                                                }}
                                                            >
                                                                Drop note
                                                            </button>
                                                        </div>
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
