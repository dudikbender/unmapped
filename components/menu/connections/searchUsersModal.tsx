import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SearchUsersInput } from "./searchUsersInput";
import { AddConnectionModal } from "./addConnectionModal";
import { User } from "@/services/types/user";

type Props = {
    show: boolean;
    handleClose: () => void;
};

export function SearchConnectionModal({ show, handleClose }: Props) {
    const [selectedUser, setSelectedUser] = useState<User | undefined>(
        undefined
    );
    return (
        <>
            <Transition.Root
                show={show && selectedUser === undefined}
                as={Fragment}
            >
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
                                <Dialog.Panel className="relative w-[90%] h-[80%] transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
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
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 ml-4"
                                            >
                                                Add Connection
                                            </Dialog.Title>
                                        </div>
                                        <div className="mt-6"></div>
                                        <SearchUsersInput
                                            handleSelection={(user) => {
                                                setSelectedUser(user);
                                            }}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <AddConnectionModal
                show={selectedUser !== undefined}
                user={selectedUser}
                handleClose={() => {
                    setSelectedUser(undefined);
                }}
            />
        </>
    );
}
