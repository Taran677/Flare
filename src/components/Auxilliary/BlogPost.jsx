import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import swal from "sweetalert";
import styles from "./BlogPost.module.css";

const BlogPost = () => {
  const { username, slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://flare-jiql.onrender.com/blog/${username}/${slug}`,
          {}
        );

        if (!response.ok) {
          throw new Error("Blog not found");
        }

        const data = await response.json();
        setBlog(data);
        console.log(data);

        // Extract headings after fetching blog data
        const newHeadings = [];
        data.blocks.forEach((block) => {
          if (
            block.type === "h1" ||
            block.type === "h2" ||
            block.type === "h3"
          ) {
            const headingId = block.content.replace(/\s+/g, "-").toLowerCase();
            newHeadings.push({
              level: block.type.replace("h", ""),
              text: block.content,
              id: headingId,
            });
          }
        });
        setHeadings(newHeadings); // Set headings only once after fetching
      } catch (err) {
        setError(err.message);
        swal({
          title: "Error",
          text: "Failed to load blog post. Please try again later.",
          icon: "error",
          button: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [username, slug]);

  const renderBlock = (block) => {
    const parseContent = (content) => {
      return content
        .replace(
          /<b>(.*?)<\/b>/g,
          (match, p1) => `<span class="${styles.bold}">${p1}</span>`
        )
        .replace(
          /<i>(.*?)<\/i>/g,
          (match, p1) => `<span class="${styles.italic}">${p1}</span>`
        )
        .replace(
          /<u>(.*?)<\/u>/g,
          (match, p1) => `<span class="${styles.underline}">${p1}</span>`
        );
    };

    switch (block.type) {
      case "image":
        return (
          <div key={block.id} className={styles.imageBlock} style={block.style}>
            <img
              src={block.imageUrl}
              alt={block.alt}
              className={styles.uploadedImage}
              loading="lazy"
            />
          </div>
        );
      case "h1":
      case "h2":
      case "h3":
        const headingId = block.content.replace(/\s+/g, "-").toLowerCase();
        return React.createElement(
          block.type,
          { key: block.id, id: headingId },
          block.content
        );
      case "paragraph":
        return (
          <p key={block.id} className={styles.paragraph}>
            {block.content}
          </p>
        );
      default:
        return (
          <div
            key={block.id}
            className={styles[block.type]}
            style={block.style}
            dangerouslySetInnerHTML={{ __html: parseContent(block.content) }}
          />
        );
    }
  };

  const renderTableOfContents = () => {
    return (
      <nav className={styles.toc}>
        <h2>Table of Contents</h2>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error loading blog post</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h2>Blog post not found</h2>
      </div>
    );
  }

  const templateClass = blog.template;

  return (
    <article className={`${styles.blogContainer} ${styles[templateClass]}`}>
      <header className={styles.blogHeader}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.metadata}>
          <time className={styles.date}>
            {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
          </time>
        </div>
      </header>
      {renderTableOfContents()} {/* Render ToC here */}
      <div className={styles.content}>
        {blog.blocks.map((block) => renderBlock(block))}
      </div>
    </article>
  );
};

export default BlogPost;
