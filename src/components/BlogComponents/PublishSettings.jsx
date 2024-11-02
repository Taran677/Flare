import React, { useState } from "react";
import swal from "sweetalert";
import styles from "./PublishSettings.module.css";

const PublishSettings = ({ onPublish }) => {
  const [slug, setSlug] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const validateSlug = (slug) => {
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(slug)) {
      return "URL path can only contain lowercase letters, numbers, and hyphens";
    }
    if (slug.length < 3) {
      return "URL path must be at least 3 characters long";
    }
    if (slug.length > 60) {
      return "URL path must be less than 60 characters";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    swal({
      title: "Confirm Publication",
      text: `Are you sure you want to publish to yourdomain.com/blog/${slug}?`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: {
          text: "Publish",
          value: true,
        },
      },
      dangerMode: true,
    }).then((willPublish) => {
      if (willPublish) {
        onPublish({ subdomain: slug, isPublic });
      }
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.publishButton}>
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishSettings;
