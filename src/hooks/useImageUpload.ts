"use client"
import { useState, useCallback } from "react";

export const useImageUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        setPreview(null);
        setFileError(null);

        return;
      }

      if (!file.type.startsWith("image/")) {
        setFileError("Only image files are allowed.");
        setPreview(null);

        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setFileError("File size must be less than 2MB.");
        setPreview(null);
        
        return;
      }

      setFileError(null);
      setPreview(URL.createObjectURL(file));
    },
    []
  );

  return { preview, fileError, handleImageChange };
};
