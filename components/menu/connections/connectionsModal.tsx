import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useConnectionStore } from "@/services/stores/connectionStore";
import { UserConnection } from "@/services/types/connections";
import { ConnectionProfileModal } from "./connectionProfileModal";
import Image from "next/image";

type Props = {
    show: boolean;
    handleClose: () => void;
};

export function ConnectionsModal({ show, handleClose }: Props) {
    const { connections } = useConnectionStore();
    const [selectedProfile, setSelectedProfile] =
        useState<UserConnection | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    return (
        <>
            <Transition.Root show={show && !showProfile} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={handleClose}
                >
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
                                            {`Your Connections`}
                                        </Dialog.Title>
                                        <ul className="mt-4 sm:divide-y sm:divide-blue-100">
                                            {connections.map(
                                                (
                                                    connection: UserConnection
                                                ) => (
                                                    <div
                                                        key={connection.uuid}
                                                        className="flex py-1 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedProfile(
                                                                connection
                                                            );
                                                            setShowProfile(
                                                                true
                                                            );
                                                            //handleClose();
                                                        }}
                                                    >
                                                        <div className="relative h-[30px] w-[30px]">
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
                                                        <li className="ml-4">
                                                            {
                                                                connection.fullName
                                                            }
                                                        </li>
                                                    </div>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <ConnectionProfileModal
                show={showProfile}
                connection={selectedProfile ?? undefined}
                handleClose={() => {
                    setShowProfile(false);
                }}
            />
        </>
    );
}
