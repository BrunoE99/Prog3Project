"use client";

import { useState } from "react";
import { updateProfilePicture } from "@/app/API/userId/route";

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    const inputElement = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setIsUploading(true);
    try {
      const result = await updateProfilePicture(selectedImage);
      resetSelection();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="flex items-center justify-center space-x-3">
        <label
          htmlFor="image-input"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded transition-colors"
        >
          Cambiar imagen
        </label>

        <input
          id="image-input"
          type="file"
          onChange={handleFile}
          accept="image/*"
          className="hidden"
        />

        <span className="text-xs text-gray-500">
          {selectedImage ? selectedImage.name : "Sin imagen"}
        </span>

        {selectedImage && (
          <>
            <button
              onClick={resetSelection}
              className="text-gray-400 hover:text-red-500 text-sm"
            >
              ✕
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50"
            >
              {isUploading ? "Subiendo..." : "Subir"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// export default function ImageUpload() {
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);

//     const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];

//         if (file) {
//             setSelectedImage(file);

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setPreviewUrl(e.target.result as string);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setSelectedImage(null);
//             setPreviewUrl(null);
//         }
//     }

//     const resetSelection = () => {
//         setSelectedImage(null);
//         setPreviewUrl(null);
//         document.getElementById('image-input').value = '';
//     };

//     return (
//         <div className="max-w-sm mx-auto p-4">
//             <div className="flex items-center space-x-3">
//                 {/* File Input Button */}
//                 <label
//                     htmlFor="image-input"
//                     className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded transition-colors"
//                 >
//                     Imagen
//                 </label>

//                 <input
//                     id="image-input"
//                     type="file"
//                     onChange={handleFile}
//                     accept="image/*"
//                     className="hidden"
//                 />

//                 {/* Status Text */}
//                 <span className="text-xs text-gray-500 flex-1">
//                     {selectedImage ? selectedImage.name : "Sin imagen"}
//                 </span>

//                 {/* Reset Button */}
//                 {selectedImage && (
//                     <button
//                         onClick={resetSelection}
//                         className="text-gray-400 hover:text-red-500 text-sm"
//                     >
//                         ✕
//                     </button>
//                 )}
//             </div>

//             {/* Image Preview */}
//             {previewUrl && (
//                 <div className="mt-3">
//                     <img
//                         src={previewUrl}
//                         alt="Preview"
//                         className="w-full h-32 object-cover rounded border border-gray-200"
//                     />
//                     <div className="mt-1 text-xs text-gray-400 text-center">
//                         {(selectedImage.size / 1024).toFixed(1)} KB
//                     </div>
//                 </div>
//             )}
//         </div>
//     )

//     //     <form>
//     //         <div className="flex flex-col mt-4 items-center">
//     //             <button onClick={ImageUpload} className="text-white py-2 px-4 mb-2 max-w-[100%] uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
//     //             Change profile image
//     //             </button>
//     //             <input placeholder="Select file" type="file" accept="image/*" className="text-white max-w-[100%] py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5" />
//     //         </div>
//     //     </form>
//     // )

// }
