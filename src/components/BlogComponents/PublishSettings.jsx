// PublishSettings.jsx
import React, { useState } from 'react';
import swal from 'sweetalert';
import styles from './PublishSettings.module.css';

export const PublishSettings = ({ onPublish, blogData }) => {
  const [subdomain, setSubdomain] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  
  const validateSubdomain = (subdomain) => {
    const regex = /^[a-zA-Z0-9-]+$/;
    if (!regex.test(subdomain)) {
      return 'Subdomain can only contain letters, numbers, and hyphens';
    }
    if (subdomain.length < 3) {
      return 'Subdomain must be at least 3 characters long';
    }
    if (subdomain.length > 63) {
      return 'Subdomain must be less than 63 characters';
    }
    return null;
  };

  const handlePreview = async () => {
    const error = validateSubdomain(subdomain);
    if (error) {
      swal({
        title: "Invalid Subdomain",
        text: error,
        icon: "error",
        button: "OK"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/blog/preview/${subdomain}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title: blogData.title,
          content: blogData.blocks,
          isPublic
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const previewData = await response.json();
      
      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      previewWindow.document.write(previewData.html);
      previewWindow.document.close();
    } catch (error) {
      swal({
        title: "Preview Error",
        text: "Failed to generate preview. Please try again.",
        icon: "error",
        button: "OK"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateSubdomain(subdomain);
    if (error) {
      swal({
        title: "Invalid Subdomain",
        text: error,
        icon: "error",
        button: "OK"
      });
      return;
    }

    swal({
      title: "Confirm Publication",
      text: `Are you sure you want to publish to ${subdomain}.yourdomain.com?`,
      icon: "warning",
      buttons: ["Cancel", "Publish"],
      dangerMode: true,
    })
    .then((willPublish) => {
      if (willPublish) {
        onPublish({ subdomain, isPublic });
      }
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Custom Subdomain
            <div className={styles.subdomainInput}>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                className={styles.input}
                placeholder="your-blog"
              />
              <span className={styles.domain}>.yourdomain.com</span>
            </div>
          </label>
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className={styles.checkbox}
            />
            Make this blog public
          </label>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handlePreview}
            className={styles.previewButton}
          >
            Preview
          </button>
          <button type="submit" className={styles.publishButton}>
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
};