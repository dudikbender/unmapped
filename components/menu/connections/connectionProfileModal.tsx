import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserConnection } from "@/services/types/connections";
import { XMarkIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { useMap } from "react-map-gl";

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
    const notesFromConnection = notes.filter(
        (note: Note) => note?.user_id === connection?.userId
    );

    const flyToNoteLocation = (noteLocation: { lat: number; lng: number }) => {
        baseMap?.flyTo({
            center: [noteLocation.lng, noteLocation.lat],
            zoom: 15,
            speed: 1.25
        });
        handleClose();
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
                                        <span className="text-sm font-semibold text-gray-700">
                                            Notes from {connection?.firstName}
                                        </span>
                                    </div>
                                    <div className="flex mt-2">
                                        <ul className="sm:divide-y sm:divide-blue-100">
                                            {notesFromConnection.map(
                                                (note: Note) => (
                                                    <div
                                                        key={note.uuid}
                                                        className="py-1 cursor-default"
                                                    >
                                                        <li>
                                                            {note.content}
                                                            {` `}
                                                            <span className="italic"></span>
                                                            <ArrowRightCircleIcon
                                                                className="h-5 w-5 inline-block ml-2 text-blue-400 hover:text-blue-500 hover:cursor-pointer"
                                                                onClick={() =>
                                                                    flyToNoteLocation(
                                                                        {
                                                                            lat: note.latitude,
                                                                            lng: note.longitude
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                        </li>
                                                    </div>
                                                )
                                            )}
                                        </ul>
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
