import React, { FC, Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Transition, Dialog } from "@headlessui/react";
import { useUser } from "@clerk/nextjs";
import { Note } from "@/services/types/note";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNoteStore } from "@/services/stores/noteStore";
import { getUser } from "@/services/users/getUser";
import {
    updateNoteContent,
    updateNoteCoordinates
} from "@/services/database/notes/updateNote";
import {
    getFullNote,
    getNoteContent
} from "@/services/database/notes/getNotes";

type Props = {
    show: boolean;
    note: Note | null;
    handleClose: () => void;
};

type AuthorData = {
    name: string;
    avatar: string;
    authorUserId: string;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const ReadNoteModal: FC<Props> = ({ show, note, handleClose }) => {
    const [showModal, setShowModal] = useState<boolean>(show);
    const [noteData, setNoteData] = useState<any | null>(note);
    const [noteContent, setNoteContent] = useState<string | undefined>(
        note?.content
    );
    const [author, setAuthor] = useState<AuthorData>({
        name: "",
        avatar: "",
        authorUserId: ""
    });
    const { user } = useUser();
    const { notes, updateNoteInStore } = useNoteStore();

    const getAuthor = async () => {
        const author = await getUser(note?.user_id);
        setAuthor({
            name: author.firstName,
            avatar: author.profileImageUrl,
            authorUserId: author.uuid
        });
    };

    useEffect(() => {
        if (note) {
            getAuthor();
        }
        const noteInStore = notes.find((n: Note) => n.uuid === note?.uuid);
        if (noteInStore) {
            setNoteData(noteInStore);
            setNoteContent(noteInStore.content);
        }
    }, [note, notes]);

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    useEffect(() => {
        if (!showModal) {
            setTimeout(handleClose, 300);
            setNoteContent(undefined);
            setAuthor({ name: "", avatar: "", authorUserId: "" });
        }
        setNoteContent(note?.content);
    }, [showModal]);

    // "Unlocks" the content if it has not been read before
    useEffect(() => {
        var content = noteContent;
        if (content === "") {
            console.log("Empty note");
            const outerFunc = async () => {
                if (!note?.uuid) {
                    return;
                }
                const noteContentFromDB = await getNoteContent(note?.uuid);
                console.log("noteContentFromDB: ", noteContentFromDB);
                if (noteContentFromDB) {
                    updateNoteInStore({
                        ...note,
                        content: noteContentFromDB?.content
                    });
                }
                const noteContentToSet = noteContentFromDB?.content
                    ? noteContentFromDB?.content
                    : "";
                // Set noteData content property to fullNote content
                setNoteData({
                    ...noteData,
                    content: noteContentToSet
                });
                return;
            };
            outerFunc();
        }
    }, [showModal]);

    useEffect(() => {
        if (noteData?.content) {
            setNoteContent(noteData?.content);
        }
    }, [noteData]);

    const handleUpdateContent = async () => {
        try {
            await updateNoteContent(noteContent, note?.uuid);
            updateNoteInStore({
                uuid: note?.uuid,
                latitude: note?.latitude,
                longitude: note?.longitude,
                content: noteContent,
                user_id: note?.user_id,
                reply_to_note: note?.reply_to_note,
                to_user_id: note?.to_user_id
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
                                                        {noteData?.latitude} ,{" "}
                                                        {noteData?.longitude}
                                                    </label>
                                                    <div className="mt-4">
                                                        <textarea
                                                            id="note-content"
                                                            name="note-content"
                                                            disabled={
                                                                noteData?.user_id !==
                                                                user?.id
                                                            }
                                                            rows={4}
                                                            className={classNames(
                                                                noteData?.user_id ===
                                                                    user?.id
                                                                    ? "border-blue-400"
                                                                    : "border-blue-200",
                                                                "shadow-sm p-2  mt-1 block w-full sm:text-sm border-gray-300 rounded-md border-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                                            )}
                                                            defaultValue={
                                                                noteContent
                                                            }
                                                            onChange={(e) =>
                                                                setNoteContent(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <div className="relative h-[30px] w-[30px]">
                                                            <Image
                                                                className="rounded-full object-cover"
                                                                src={
                                                                    author
                                                                        .avatar
                                                                        ?.length >
                                                                    0
                                                                        ? author.avatar
                                                                        : "/placeholder-author.png"
                                                                }
                                                                alt="Note Author Image"
                                                                fill={true}
                                                            />
                                                        </div>
                                                        <div className="my-2 ml-2 cursor-default">
                                                            <span className="text-xs">
                                                                Note Dropped by{" "}
                                                                {user?.id ===
                                                                author.authorUserId ? (
                                                                    <span className="text-blue-500">
                                                                        you
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-blue-500">
                                                                        {
                                                                            author.name
                                                                        }
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {user?.id ===
                                                    author.authorUserId ? (
                                                        <div className="mt-4">
                                                            <button
                                                                className="p-2 text-gray-900 border-2 border-gray-200 rounded-lg hover:bg-blue-500 hover:text-white"
                                                                onClick={() => {
                                                                    handleUpdateContent();
                                                                }}
                                                                disabled={
                                                                    noteContent?.length ===
                                                                        0 ||
                                                                    noteContent ===
                                                                        noteData?.content
                                                                }
                                                            >
                                                                Update note
                                                            </button>
                                                        </div>
                                                    ) : null}
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
