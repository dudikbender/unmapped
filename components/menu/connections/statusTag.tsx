import { FC } from "react";

type StatusTagProps = {
    status: string;
};

export const StatusTag: FC<StatusTagProps> = ({ status }) => {
    const baseTailwindCSS = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 cursor-default`;
    const colourPicker = (status: string) => {
        switch (status) {
            case "Request":
                return "bg-blue-100 text-blue-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Accept":
                return "bg-green-100 text-green-800";
            case "Connected":
                return "bg-green-100 text-green-800";
            case "Disconnect":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const titlePicker = (status: string) => {
        switch (status) {
            case "Request":
                return "Not Connected";
            case "Pending":
                return "Pending";
            case "Accept":
                return "Pending";
            case "Connected":
                return "Connected";
            default:
                return "Not Connected";
        }
    };
    return (
        <span className={`${baseTailwindCSS} ${colourPicker(status)}`}>
            {titlePicker(status)}
        </span>
    );
};
