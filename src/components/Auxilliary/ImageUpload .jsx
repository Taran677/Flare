// ImageUpload.jsx
import React, { useState } from "react";
import styles from "./ImageUpload.module.css";
import Swal from "sweetalert";

const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
    }

    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      setImageFile(file);
    } catch (error) {
      Swal({
        title: "Invalid File",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      Swal({
        title: "Error",
        text: "Please select an image file to upload",
        icon: "error",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:3000/user/upload-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      Swal({
        title: "Success!",
        text: "Image uploaded successfully",
        icon: "success",
      });

      // Reset the form
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload error:", error);
      Swal({
        title: "Error",
        text: "Failed to upload image",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadArea}>
        <label className={styles.fileLabel}>
          <div className={styles.uploadContent}>
            {previewUrl ? (
              <div className={styles.previewContainer}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={styles.imagePreview}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <i
                  className={`fas fa-cloud-upload-alt ${styles.uploadIcon}`}
                ></i>
                <p className={styles.uploadText}>
                  Click to upload or drag and drop
                </p>
                <p className={styles.uploadSubtext}>
                  PNG, JPG, GIF or WebP (MAX. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className={styles.fileInput}
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!imageFile || isLoading}
        className={`${styles.uploadButton} ${
          !imageFile || isLoading ? styles.disabled : ""
        }`}
      >
        {isLoading ? (
          <span className={styles.loadingText}>
            <i className={`fas fa-spinner fa-spin ${styles.spinner}`}></i>
            Uploading...
          </span>
        ) : (
          <>
            <i className="fas fa-upload"></i>
            Upload Image
          </>
        )}
      </button>
    </div>
  );
};

export default ImageUpload;

export const triggerProfileUpload = () => {
  Swal({
    title: "Update Profile Picture",
    text: "Choose a new profile photo:",
    content: {
      element: "input",
      attributes: {
        type: "file",
        accept: "image/*",
        className: "swal-content__input",
      },
    },
    buttons: {
      cancel: "Cancel",
      confirm: {
        text: "Upload",
        closeModal: false,
      },
    },
  }).then((willUpload) => {
    if (willUpload) {
      const fileInput = document.querySelector(".swal-content__input");
      const file = fileInput?.files?.[0];
      if (!file) {
        Swal.close();
        return;
      }

      // Create FormData and upload
      const formData = new FormData();
      formData.append("profilePicture", file);
      console.log(formData);
      fetch("http://localhost:3000/user/update-profile-picture", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Upload failed");
          return response.json();
        })
        .then(() => {
          Swal({
            title: "Success!",
            text: "Profile picture updated successfully",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Upload error:", error);
          Swal({
            title: "Error",
            text: "Failed to update profile picture",
            icon: "error",
          });
        });
    }
  });
};
