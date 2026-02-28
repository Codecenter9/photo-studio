// "use client";

// import { CldUploadWidget } from "next-cloudinary";

// interface Props {
//     folderPath: string;
//     onUploadSuccess?: (data: any) => void;
// }

// export default function UploadButton({
//     folderPath,
//     onUploadSuccess,
// }: Props) {
//     return (
//         <CldUploadWidget
//             signatureEndpoint="/api/sign-cloudinary-params"
//             options={{
//                 folder: folderPath,
//                 resourceType: "auto",
//             }}
//             onSuccess={(result: any) => {
//                 const info = result.info;

//                 const fileData = {
//                     fileName: info.original_filename,
//                     publicId: info.public_id,
//                     secureUrl: info.secure_url,
//                     format: info.format,
//                     size: info.bytes,
//                     resourceType: info.resource_type,
//                 };

//                 onUploadSuccess?.(fileData);
//             }}
//         >
//             {({ open }) => (
//                 <button
//                     onClick={() => open()}
//                     className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >
//                     Upload File
//                 </button>
//             )}
//         </CldUploadWidget>
//     );
// }

import React from 'react'

const UploadButton = () => {
    return (
        <div>
            upload widgt
        </div>
    )
}

export default UploadButton
