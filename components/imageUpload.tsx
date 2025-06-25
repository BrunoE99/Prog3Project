"use client";

import { useState } from "react";
import { updateProfilePicture } from "@/app/API/userId/userIdRoute";
import { useTranslations } from "next-intl";

export default function ImageUpload() {
  const t = useTranslations("ImageUpload");
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
      await updateProfilePicture(selectedImage);
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
          {t("main-label")}
        </label>

        <input
          id="image-input"
          type="file"
          onChange={handleFile}
          accept="image/*"
          className="hidden"
        />

        <span className="text-xs text-gray-500">
          {selectedImage ? selectedImage.name : t("image-placeholder")}
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
              {isUploading ? t("upload-in-progress") : t("upload-button")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
