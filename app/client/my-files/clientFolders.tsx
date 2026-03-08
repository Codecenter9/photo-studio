import DeleteModal from '@/components/ui/deleteModal';
import { handleError } from '@/lib/error';
import { IFile } from '@/types/models/File';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import axios from 'axios';
import { EllipsisVertical, Folder } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

interface ClientFolderPropes {
  activeTab: string;
  fetchFolders: (clientId: string, status: string) => Promise<void>;
  folders: {
    _id: string;
    name: string;
    clientId: string;
  }[];
  clientId?: string;
  setSelectedFolderId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClientFolders = ({ clientId, activeTab, fetchFolders, folders, setSelectedFolderId }: ClientFolderPropes) => {

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [viewDetailFolderId, setViewDetailFolderId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const handleFolderClick = (folderId: string) => {
    if (setSelectedFolderId) {
      setSelectedFolderId(folderId);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      await axios.put(`/api/folders/${id}`, {
        isVisibileForClient: false,
      });

      setFolderToDelete(null);
      setOpenDropdownId(null);
      setSnackbarMessage("Folder updated successfully");
      setSnackbarOpen(true);

      if (clientId) {
        fetchFolders(clientId, activeTab);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchPhotos = useCallback(async () => {
    if (!viewDetailFolderId || !clientId) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/photo", {
        params: {
          folderId: viewDetailFolderId,
          clientId: clientId,
        },
      });

      setFiles(response.data);

    } catch (err: unknown) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [viewDetailFolderId, clientId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const filteredFiles = files.filter((file) => file?.folderId === viewDetailFolderId && file?.isVisibleForClient);
  const videos = filteredFiles.filter((video) => video?.resourceType === "video");
  const images = filteredFiles.filter((image) => image?.resourceType === "image");

  const selectedFolderToView = folders.find((folder) => folder._id === viewDetailFolderId);


  return (
    <>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="col-span-3">
          {folders.map((item) => (
            <div key={item._id} className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div
                    onClick={() => handleFolderClick(folder._id)}
                    key={folder._id}
                    className="relative flex flex-col items-center gap-3 
                              hover:bg-gray-100 border border-gray-300 
                              cursor-pointer p-2 rounded-md transition-all duration-200" >
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg">
                      <Folder size={28} className="text-white" />
                    </div>

                    <p className="font-medium text-gray-800 truncate">
                      {folder.name}
                    </p>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(
                          openDropdownId === folder._id ? null : folder._id
                        );
                      }}
                      className="absolute top-1 right-1"
                    >
                      <IconButton size="small">
                        <EllipsisVertical size={16} />
                      </IconButton>
                    </div>
                    {openDropdownId === folder._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-10 right-2 bg-white shadow-md border rounded-md py-2 px-3 flex flex-col gap-2 z-10"
                      >
                        <span
                          onClick={() => {
                            setViewDetailFolderId(folder._id);
                            setOpenDropdownId(null);
                          }}
                          className="hidden lg:flex text-sm text-gray-600 hover:text-black cursor-pointer"
                        >
                          View Details
                        </span>

                        <span
                          onClick={() => {
                            setFolderToDelete(folder._id);
                            setDeleteModalOpen(true);
                          }}
                          className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {viewDetailFolderId && (
          <div className="h-max border border-gray-300 rounded-md p-6">
            {loading ? (
              <p className="flex items-center justify-start gap-1">
                Loading details...
              </p>
            ) : error ? (

              <p className="flex bg-yellow-100 text-red-600 px-3 py-1 rounded-md">
                {error}
              </p>
            ) : filteredFiles.length === 0 ? (
              <p>No details about this folder</p>

            ) : (
              <div className="flex flex-col items-center gap-5">
                <div className="w-full flex items-center flex-col gap-2">
                  <span className="text-center text-lg font-serif font-light capitalize">details of <em>{selectedFolderToView?.name}</em></span>
                  <hr className='h-1 w-full text-gray-300' />
                </div>
                <div className="flex flex-col gap-3 items-center w-full">
                  <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                    <p>Name:</p>
                    {selectedFolderToView?.name}
                  </span>
                  <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                    <p>Images:</p>
                    {images?.length}
                  </span>
                  <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                    <p>Videos:</p>
                    {videos?.length}
                  </span>
                  <span className="w-full flex justify-between gap-2 text-sm bg-gray-900/5 border border-gray-300 px-3 py-1 rounded-md font-serif">
                    <p>Total Files:</p>
                    {filteredFiles?.length}
                  </span>
                </div>
                <div onClick={() => {
                  setFolderToDelete(viewDetailFolderId);
                  setDeleteModalOpen(true);
                }} className="w-full flex items-center justify-center">
                  <Button variant='outlined' fullWidth color='error' size='small' >Delete Folder</Button>
                </div>
              </div>
            )}
          </div>
        )
        }

      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="flex flex-col">
        <DeleteModal
          isOpen={deleteModalOpen}
          title="Delete Folder"
          description="Are you sure you want to delete this folder? This action cannot be undone."
          onClose={() => {
            setDeleteModalOpen(false);
            setFolderToDelete(null);
          }}
          onConfirm={() => {
            if (folderToDelete) {
              handleDelete(folderToDelete);
            }
          }}
          confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        />
      </div>
    </>
  )
}

export default ClientFolders
