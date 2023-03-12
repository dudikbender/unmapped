import { BaseMap } from "@/components/map/baseMap";
import { Menu } from "@/components/menu/menu";

export default function Home() {
    return (
        <div className="relative">
            <BaseMap>
                <div className="absolute hidden sm:flex inset-x-0 top-0 pt-4 justify-items-center">
                    <div className="m-auto p-2 cursor-default text-lg">
                        unmapped
                    </div>
                </div>
                <div className="absolute flex left-0 top-0 pt-4 justify-items-center">
                    <Menu />
                </div>
                <div className="absolute flex right-0 top-0 pt-4 justify-items-center">
                    <div
                        className="rounded-md bg-white m-auto p-2 mr-2 cursor-default text-lg 
                                    hover:bg-gray-400 hover:text-white hover:cursor-pointer"
                    >
                        profile
                    </div>
                </div>
            </BaseMap>
        </div>
    );
}
