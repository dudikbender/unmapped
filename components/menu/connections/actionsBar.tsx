import { FC } from "react";

type ActionsProps = {
    status: string;
    action: () => void;
};

export const ActionsBar: FC<ActionsProps> = ({ status, action }) => {
    const baseTailwindCSS = `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white ring-2 hover:text-white focus:outline-none`;
    const colourPicker = (status: string) => {
        switch (status) {
            case "Request":
                return "ring-blue-500 hover:bg-blue-500 text-gray-900";
            case "Pending":
                return "ring-yellow-500 hover:bg-yellow-500  text-gray-900";
            case "Accept":
                return "ring-green-500 hover:bg-green-500 text-gray-900";
            case "Connected":
                return "ring-gray-500 hover:bg-gray-500 text-gray-900";
            default:
                return "ring-blue-500 hover:bg-blue-500 text-gray-900";
        }
    };
    const titlePicker = (status: string) => {
        switch (status) {
            case "Request":
                return "Request";
            case "Pending":
                return "Delete Request?";
            case "Accept":
                return "Accept";
            case "Connected":
                return "Disconnect";
            default:
                return "Request";
        }
    };
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    className={`${baseTailwindCSS} ${colourPicker(status)}`}
                    onClick={() => {
                        action();
                    }}
                >
                    {`${titlePicker(status)}`}
                </button>
            </div>
        </div>
    );
};
