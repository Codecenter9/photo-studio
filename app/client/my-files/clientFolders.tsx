import { Folder } from 'lucide-react'
import React from 'react'

interface ClientFolderPropes {
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

const ClientFolders = ({ folders, loadingFolder, selected, setSelected, selectedClientId, setSelectedFolderId }: ClientFolderPropes) => {

  const handleFolderClick = (folderId: string) => {
    if (setSelectedFolderId) {
      setSelectedFolderId(folderId);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="flex flex-2">
        {folders.map((item) => (
          <div key={item._id} className="w-full">
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
        ))}
      </div>
      <div className="flex flex-1">
        details
      </div>
    </div>
  )
}

export default ClientFolders
