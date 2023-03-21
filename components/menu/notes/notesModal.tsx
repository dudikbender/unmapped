import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNoteStore } from "@/services/stores/noteStore";
import { Note } from "@/services/types/note";
import { useUser } from "@clerk/nextjs";
import { useMap } from "react-map-gl";
import { NoteList } from "./notesList";
import { MenuTabs, Tab } from "@/components/ui/tabs";
import { ReadNoteModal } from "@/components/modals/readNote";

type Props = {
    show: boolean;
    handleClose: () => void;
};

export function NotesList({ show, handleClose }: Props) {
    const [tabSelected, setTabSelected] = useState("Received");
    const { user } = useUser();
    const { notes } = useNoteStore();
    const { baseMap } = useMap();
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

    const flyToNoteLocation = (noteLocation: { lat: number; lng: number }) => {
        baseMap?.flyTo({
            center: [noteLocation.lng, noteLocation.lat],
            zoom: 15,
            speed: 1.25
        });
        handleClose();
    };

    const tabs: Tab[] = [
        {
            name: "Received",
            current: tabSelected === "Received"
        },
        {
            name: "Sent",
            current: tabSelected === "Sent"
        }
    ];

    return (
        <>
            <Transition.Root show={show} as={Fragment}>
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
                                <Dialog.Panel className="relative w-[90%] transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <MenuTabs
                                            tabs={tabs}
                                            initialSelected={tabSelected}
                                            onChange={(e) => setTabSelected(e)}
                                        />
                                        <div className="mt-4">
                                            {tabSelected === "Received" ? (
                                                <>
                                                    <NoteList
                                                        notes={receivedNotes}
                                                        recipient={true}
                                                        mapObject={baseMap}
                                                        handleClose={
                                                            handleClose
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <NoteList
                                                        notes={sentNotes}
                                                        recipient={false}
                                                        mapObject={baseMap}
                                                        handleClose={
                                                            handleClose
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
