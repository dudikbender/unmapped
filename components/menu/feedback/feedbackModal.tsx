import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { addFeedback } from "@/services/database/feedback/submitFeedback";
import { useUser } from "@clerk/nextjs";

type Props = {
    show: boolean;
    handleClose: () => void;
};

export function FeedbackModal({ show, handleClose }: Props) {
    const [content, setContent] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { user } = useUser();

    const handleSubmit = async () => {
        if (!user) {
            return;
        }
        const feedback = await addFeedback(
            user?.id,
            content,
            user?.emailAddresses[0].emailAddress
        );
        console.log("Feedback: ", feedback);
        if (feedback === 201) {
            setSubmitted(true);
            setContent("");
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
                                <div className="my-3 text-center sm:mt-5 w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900"
                                    >
                                        {!submitted
                                            ? `We'd love to hear from you!`
                                            : "Thanks!"}
                                    </Dialog.Title>
                                    {!submitted ? (
                                        <>
                                            <div className="my-6 inline-flex w-full">
                                                <textarea
                                                    className="w-full p-2 rounded-md text-gray-900 focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`Want a new feature? Hate how something works? Just need to vent?\n\nShare your feedback with the Unmapped team here.`}
                                                    onChange={(e) =>
                                                        setContent(
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={5}
                                                    defaultValue={content}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        handleSubmit();
                                                    }}
                                                    type="button"
                                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white 
                                                               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    {`Submit Feedback`}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="my-6 w-full">
                                                <p className="text-sm text-gray-900">
                                                    {`We've just started working on Unmapped but we really appreciate any and all feedback to make it better.`}
                                                </p>
                                                <br></br>
                                                <p className="text-sm text-gray-900">
                                                    {`Unless you're a dick, in which case go away...`}
                                                </p>
                                            </div>
                                            <div className="mt-5">
                                                <button
                                                    onClick={() =>
                                                        setSubmitted(false)
                                                    }
                                                    type="button"
                                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                                >
                                                    {`Submit again...`}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
