import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    UserConnection,
    DatabaseConnection
} from "@/services/types/connections";
import { XMarkIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { useMap } from "react-map-gl";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { NotesFromConnection } from "./notesFromConnection";
import { NoteList } from "../notes/notesList";

type Props = {
    show: boolean;
    connection?: UserConnection;
    handleClose: () => void;
};

export function ConnectionProfileModal({
    show,
    connection,
    handleClose
}: Props) {
    const { notes } = useNoteStore();
    const { baseMap } = useMap();
    const { connections } = useConnectionStore();
    const connectionInStore = connections.find(
        (conn: UserConnection) => conn?.userId === connection?.userId
    );
    const connectionStatus = connectionInStore
        ? connectionInStore?.accepted
            ? "Connected"
            : connectionInStore?.requesterUser === connection?.userId
            ? "Accept" // Waiting for the other user to accept the inviation to connect
            : "Pending" // Waiting for the current user to accept the invitation to connect
        : "None";
    const notesFromConnection = notes.filter(
        (note: Note) => note?.user_id === connection?.userId
    );
    console.log("Connections: ", connections);
    console.log("Status: ", connectionInStore);

    const handleNoteList = () => {
        switch (connectionStatus) {
            case "Connected":
                return (
                    <NotesFromConnection
                        notes={notesFromConnection}
                        mapObject={baseMap}
                        handleClose={handleClose}
                    />
                );
            case "Pending":
                return (
                    <div className="flex flex-col items-center justify-center">
                        <h3>{`Waiting for ${connection?.firstName} to accept your connection request`}</h3>
                    </div>
                );
            case "Accept":
                return (
                    <div className="flex flex-col items-center justify-center">
                        <h3>{`Accept ${connection?.firstName}'s request to connect.`}</h3>
                    </div>
                );
            case "None":
                return (
                    <div className="flex flex-col items-center justify-center">
                        <h3>{`Ask ${connection?.firstName} to connect from the sidebar menu.`}</h3>
                    </div>
                );
        }
    };

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
                    <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
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
                                    <div
                                        key="close-modal-button"
                                        aria-details="close-modal-button"
                                        className="absolute p-1 m-2 flex right-0 top-0 text-gray-900 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="relative h-[50px] w-[50px]">
                                            <Image
                                                className="rounded-full object-cover"
                                                src={
                                                    connection?.profileImageUrl ??
                                                    "/placeholder-author.png"
                                                }
                                                alt="Connection Image"
                                                fill={true}
                                            />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-900 ml-4"
                                        >
                                            {connection?.fullName}
                                        </Dialog.Title>
                                    </div>
                                    <div className="mt-6">
                                        {handleNoteList()}
                                        {/* <NotesFromConnection
                                            notes={notesFromConnection}
                                            mapObject={baseMap}
                                            handleClose={handleClose}
                                        /> */}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
