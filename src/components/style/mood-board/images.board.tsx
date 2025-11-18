import { MoodBoardImage } from "@/hooks/use-styles";
import { AlertCircleIcon, CheckCircleIcon, Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";

function UploadStatus(image: { uploading: boolean; uploaded: boolean; error?: string }) {
    if (image.uploading)
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <Loader2Icon className="size-6 text-white animate-spin" />
            </div>
        );

    if (image.uploaded)
        return (
            <div className="absolute top-2 right-2">
                <CheckCircleIcon className="size-5 text-green-400" />
            </div>
        );

    if (image.error)
        return (
            <div className="absolute top-2 right-2">
                <AlertCircleIcon className="size-5 text-red-400" />
            </div>
        );

    return null;
}

type Props = {
    image: MoodBoardImage;
    removeImage: (id: string) => void;
    xOffset: number;
    yOffset: number;
    rotation: number;
    zIndex: number;
    marginLeft: string;
    marginTop: string;
};

export default function ImageBoard({
    image,
    removeImage,
    xOffset,
    yOffset,
    rotation,
    zIndex,
    marginLeft,
    marginTop,
}: Props) {
    return (
        <div
            key={`board-${image.id}`}
            className="absolute group"
            style={{
                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
                zIndex: zIndex,
                left: "50%",
                top: "50%",
                marginLeft: marginLeft, // Half of mobile image width (160px / 2)
                marginTop: marginTop, // Half of mobile image height (192px / 2)
            }}
        >
            <div className="relative w-40 h-48 rounded-2xl overflow-hidden bg-white shadow-xl border border-border/20 hover:scale-105 transition-all duration-200">
                <Image src={image.preview} alt="Mood board image" fill className="object-cover" />

                <UploadStatus uploading={image.uploading} uploaded={image.uploaded} error={image.error} />

                <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 size-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <XIcon className="size-4 text-white" />
                </button>
            </div>
        </div>
    );
}
