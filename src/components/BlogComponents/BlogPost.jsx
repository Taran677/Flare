import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sweetAlert from "sweetalert";
import styles from "./BlogPost.module.css";

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/blog/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          showError(
            "Blog Not Found! The blog post you're looking for doesn't exist."
          );
          return;
        }
        throw new Error("Failed to fetch blog post");
      }

      const data = await response.json();
      setBlog(data);
      showSuccess("Blog post loaded successfully");
    } catch (err) {
      showError("Failed to load the blog post. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  useEffect(() => {
    if (loading) {
      sweetAlert({
        title: "Loading...",
        text: "Fetching blog post",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
      });
    } else {
      sweetAlert.close();
    }
  }, [loading]);

  const getBlockStyle = (type) => {
    switch (type) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "h3":
        return styles.h3;
      case "image":
        return styles.image;
      default:
        return styles.paragraph;
    }
  };

  const renderBlock = (block) => {
    const blockStyle = getBlockStyle(block.type);
    const combinedClassName = blockStyle;

    switch (block.type) {
      case "h1":
        return (
          <h1
            key={block._id}
            className={combinedClassName}
            style={block.style}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "h2":
        return (
          <h2
            key={block._id}
            className={combinedClassName}
            style={block.style}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "h3":
        return (
          <h3
            key={block._id}
            className={combinedClassName}
            style={block.style}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "paragraph":
        return (
          <div
            key={block._id}
            className={combinedClassName}
            style={block.style}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
      case "image":
        return (
          <img
            key={block._id}
            src={block.imageUrl}
            className={styles.image}
          ></img>
        );

      default:
        return null;
    }
  };

  if (!blog && !loading) {
    return (
      <div className={styles.error}>Blog not found or an error occurred.</div>
    );
  }

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <h1 className={styles.title}>{blog?.title}</h1>
        <div className={styles.meta}>
          <span className={styles.author}>
            By {blog?.author.nickname || blog?.author.username}
          </span>
          <time className={styles.date}>
            {blog?.createdAt && new Date(blog.createdAt).toLocaleDateString()}
          </time>
          <span className={styles.status}>Status: {blog?.status}</span>
        </div>
      </header>

      <div className={styles.content}>
        {blog?.blocks.map((block) => renderBlock(block))}
      </div>
    </article>
  );
};

// Helper functions remain the same
const showSuccess = (message) => {
  sweetAlert({
    title: "Success!",
    text: message,
    icon: "success",
    timer: 2000,
    buttons: false,
  });
};

const showError = (error) => {
  sweetAlert({
    title: "Error!",
    text: error,
    icon: "error",
    button: "OK",
  });
};

export default BlogPost;
