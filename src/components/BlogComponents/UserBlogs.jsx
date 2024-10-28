import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { ChevronRight, Pencil, Trash2, Plus } from 'lucide-react';
import styles from './UserBlogsPage.module.css';

const UserBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/blog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          swal("Session Expired", "Please login again to continue", "warning")
            .then(() => navigate('/login'));
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      swal("Error", "Failed to load blogs. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this blog!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://localhost:3000/blog/${blogId}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) throw new Error('Failed to delete blog');
          
          swal("Success", "Blog has been deleted!", "success");
          fetchUserBlogs();
        } catch (error) {
          swal("Error", "Failed to delete blog. Please try again.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Blogs</h1>
        <button
          onClick={() => navigate('/blog/new')}
          className={styles.newBlogButton}
        >
          <Plus size={20} />
          New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className={styles.emptyState}>
            <img src="/man-working.svg" alt="error" />
          <p className={styles.emptyStateText}>You haven't created any blogs yet.</p>
          <button
            onClick={() => navigate('/blog/new')}
            className={styles.createFirstBlog}
          >
            Create your first blog
          </button>
        </div>
      ) : (
        <div className={styles.blogGrid}>
          {blogs.map((blog) => (
            <div key={blog._id} className={styles.blogCard}>
              <div className={styles.blogInfo}>
                <h2 className={styles.blogTitle}>{blog.title}</h2>
                <div className={styles.blogMeta}>
                  <span>Status: {blog.status}</span>
                  <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className={styles.actions}>
                <button
                  onClick={() => navigate(`/blog/edit/${blog.slug}`)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                  title="Edit blog"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  title="Delete blog"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className={`${styles.actionButton} ${styles.viewButton}`}
                  title="View blog"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogsPage;