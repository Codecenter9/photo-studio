"use client";

import { Folder, } from "lucide-react";
interface FolderSectionPropes {
    folders: {
        _id: string;
        name: string;
        clientId: string;
    }[];
    loadingFolder: boolean;
    selected: number[];
    setSelected: React.Dispatch<React.SetStateAction<number[]>>;
    selectedClientId?: string | null;
    setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const FolderSection = ({ selected, setSelected, setSelectedFolderId, folders, selectedClientId, loadingFolder }: FolderSectionPropes) => {

    const handleFolderClick = (folderId: string) => {
        if (setSelectedFolderId) {
            setSelectedFolderId(folderId);
        }
    };

    return (
        <div className="flex items-center justify-start">
            {selectedClientId ? (
                <div className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {folders.map((folder) => (
                            <div
                                onClick={() => handleFolderClick(folder._id)}
                                key={folder._id}
                                className="flex flex-col items-center gap-3 hover:bg-gray-100 border border-gray-300 cursor-pointer p-4 rounded-md transition-all duration-200"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg">
                                    <Folder size={28} className="text-white" />
                                </div>

                                <p className="font-medium text-gray-800 truncate">
                                    {folder.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    Please select a client to view photos.
                </div>
            )}

        </div>
    );
};

export default FolderSection;