import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { User } from "@/services/types/user";
import { useUser } from "@clerk/nextjs";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { UserConnection } from "@/services/types/connections";
import {
    addConnection,
    acceptConnection,
    deleteConnection
} from "@/services/database/connections/actions";
import { ActionsBar } from "./actionsBar";
import { StatusTag } from "./statusTag";

type Props = {
    show: boolean;
    user?: User;
    handleClose: () => void;
};

export function AddConnectionModal({ show, user, handleClose }: Props) {
    const [userData, setUserData] = useState<User | undefined>(user);
    const [status, setStatus] = useState<string>("Request");
    const { user: currentUser } = useUser();
    const {
        connections,
        addConnectionToStore,
        updateConnectionInStore,
        deleteConnectionInStore
    } = useConnectionStore();
    const isConnection = connections.find(
        (connection: UserConnection) => connection.userId === userData?.uuid
    );
    const handleRequest = async () => {
        if (isConnection) {
            return;
        }
        const backendRequest = await addConnection(currentUser?.id, user?.uuid);

        if (backendRequest[0]) {
            const newConnection: UserConnection = {
                id: backendRequest[0].id,
                uuid: backendRequest[0].uuid,
                userId: user?.uuid,
                accepted: false,
                acceptedDate: backendRequest[0].accepted_date,
                requesterUser: currentUser?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                fullName: `${user?.firstName} ${user?.lastName}`,
                profileImageUrl: user?.profileImageUrl,
                createdAt: backendRequest[0].created_at
            };
            setStatus("Pending");
            addConnectionToStore(newConnection);
        }
    };
    const handleAccept = async () => {
        console.log(isConnection?.uuid);
        const backendRequest = await acceptConnection(isConnection.uuid);
        if (backendRequest === 204) {
            updateConnectionInStore(backendRequest);
            setStatus("Connected");
        }
    };
    const handleDisconnect = async () => {
        const backendRequest = await deleteConnection(isConnection.uuid);
        if (backendRequest === 204) {
            deleteConnectionInStore(isConnection.uuid);
            setStatus("Request");
        }
    };

    const handleAction = () => {
        switch (status) {
            case "Request":
                handleRequest();
                break;
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

    useEffect(() => {
        if (isConnection?.accepted) {
            setStatus("Connected");
        } else if (
            isConnection?.accepted === false ||
            isConnection?.accepted === null
        ) {
            if (isConnection?.requesterUser === currentUser?.id) {
                setStatus("Pending");
            } else {
                setStatus("Accept");
            }
        } else if (!isConnection) {
            setStatus("Request");
        }
    }, [isConnection, connections, status]);

    useEffect(() => {
        setUserData(user);
    }, [user]);

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
                            <Dialog.Panel className="relative w-[90%] transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                <div key="profile-overview">
                                    <div
                                        key="close-modal-button"
                                        aria-details="close-modal-button"
                                        className="absolute p-1 m-2 flex right-0 top-0 text-gray-900 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer"
                                        onClick={handleClose}
                                    >
                                        <ArrowLeftIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="relative h-[50px] w-[50px]">
                                            <Image
                                                className="rounded-full object-cover"
                                                src={
                                                    userData?.profileImageUrl ??
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
                                                {userData?.fullName}
                                            </Dialog.Title>
                                            <div
                                                id="status-tag"
                                                className="ml-4"
                                            >
                                                <StatusTag status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <ActionsBar
                                            status={status}
                                            action={() => handleAction()}
                                        />
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
