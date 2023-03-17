import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { useUser } from "@clerk/nextjs";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { UserConnection } from "@/services/types/connections";

type Props = {
    show: boolean;
    handleClose: () => void;
};

export function NotesList({ show, handleClose }: Props) {
    const { user } = useUser();
    const { notes } = useNoteStore();
    const { connections } = useConnectionStore();
    const receivedNotes = notes
        .filter((note: Note) => note.to_user_id === user?.id)
        .sort((a: any, b: any) => {
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        });
    const sentNotes = notes
        .filter((note: Note) => note.user_id === user?.id)
        .sort((a: any, b: any) => {
            return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
        });

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-700"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-500"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                        {`Your Received Notes`}
                                    </Dialog.Title>
                                    <ul className="sm:divide-y sm:divide-blue-100">
                                        {receivedNotes.map((note: Note) => (
                                            <div
                                                key={note.uuid}
                                                className="py-1 cursor-default"
                                            >
                                                <li>
                                                    {note.content}
                                                    {` `}
                                                    <span className="italic">
                                                        from{" "}
                                                        {
                                                            connections.filter(
                                                                (
                                                                    connection: UserConnection
                                                                ) =>
                                                                    connection.userId ===
                                                                    note.user_id
                                                            )[0]?.fullName
                                                        }
                                                    </span>
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                                <div className="border-t-2 border-blue-400 my-4" />
                                <div>
                                    <Dialog.Title
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                        {`Your Sent Notes`}
                                    </Dialog.Title>
                                    <ul className="sm:divide-y sm:divide-blue-100">
                                        {sentNotes.map((note: Note) => (
                                            <div
                                                key={note.uuid}
                                                className="py-1 cursor-default"
                                            >
                                                <li>
                                                    {note.content}
                                                    {` `}
                                                    <span className="italic">
                                                        to{" "}
                                                        {
                                                            connections.filter(
                                                                (
                                                                    connection: UserConnection
                                                                ) =>
                                                                    connection.userId ===
                                                                    note.to_user_id
                                                            )[0]?.fullName
                                                        }
                                                    </span>
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
