import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserConnection } from "@/services/types/connections";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { useUser } from "@clerk/nextjs";
import { useMap } from "react-map-gl";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { NotesFromConnection } from "./notesFromConnection";
import { StatusTag } from "./statusTag";
import { ActionsBar } from "./actionsBar";
import {
    addConnection,
    acceptConnection,
    deleteConnection
} from "@/services/database/connections/actions";

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
    const { user: currentUser } = useUser();
    const {
        connections,
        addConnectionToStore,
        updateConnectionInStore,
        deleteConnectionInStore
    } = useConnectionStore();
    const [status, setStatus] = useState<string>("Connected");
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

    console.log(connectionInStore);

    const handleAccept = async () => {
        console.log(connectionInStore?.uuid);
        const backendRequest = await acceptConnection(connectionInStore.uuid);
        if (backendRequest === 204) {
            const newConnection = connectionInStore;
            newConnection.accepted = true;
            newConnection.acceptedDate = new Date();
            updateConnectionInStore(newConnection);
            setStatus("Connected");
        }
    };
    const handleDisconnect = async () => {
        const backendRequest = await deleteConnection(connectionInStore.uuid);
        if (backendRequest === 204) {
            deleteConnectionInStore(connectionInStore.uuid);
            handleClose;
        }
    };

    const handleAction = () => {
        switch (connectionStatus) {
            case "Accept":
                handleAccept();
                break;
            case "Pending":
                handleDisconnect();
                break;
            case "Connected":
                handleDisconnect();
                break;
            default:
                break;
        }
    };

    const handleNoteList = () => {
        switch (connectionStatus) {
            case "Connected":
                return (
                    <>
                        <div className="mt-4 font-semibold text-lg">
                            Notes from {connection?.firstName}
                        </div>
                        <NotesFromConnection
                            notes={notesFromConnection}
                            mapObject={baseMap}
                            handleClose={handleClose}
                        />
                    </>
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
        }
    };

    useEffect(() => {
        if (connectionInStore?.accepted) {
            setStatus("Connected");
        } else if (
            connectionInStore?.accepted === false ||
            connectionInStore?.accepted === null
        ) {
            if (connectionInStore?.requesterUser === currentUser?.id) {
                setStatus("Pending");
            } else {
                setStatus("Accept");
            }
        } else {
            setStatus("None");
        }
    }, [connectionInStore, connections, status]);

    useEffect(() => {
        if (connectionStatus === "None" || connectionStatus === null) {
            handleClose();
        }
    }, [connectionStatus]);

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-10 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div>
                                    <div
                                        key="close-modal-button"
                                        aria-details="close-modal-button"
                                        className="absolute p-1 m-2 flex right-0 top-0 text-gray-900 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center mr-12">
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
                                        <div className="grid">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 ml-4 pl-1"
                                            >
                                                {connection?.fullName}
                                            </Dialog.Title>
                                            <div
                                                id="status-tag"
                                                className="ml-4"
                                            >
                                                <StatusTag status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex mt-6">
                                        <ActionsBar
                                            status={status}
                                            action={() => handleAction()}
                                        />
                                    </div>
                                    <div className="flex mt-2">
                                        {handleNoteList()}
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
