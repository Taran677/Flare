import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resizeImage, validateImage } from "./imageUtils";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Image,
  Smile,
  Bold,
  Italic,
  MessageSquare,
  Underline,
  Save,
  Eye,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import swal from "sweetalert";
import styles from "./BlogEditor.module.css";
import { TemplateSelector } from "./TemplateSelector";
import PublishSettings from "./PublishSettings";
import { templates } from "./blogTemplates";
import { template } from "lodash";
const BlogEditor = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([
    { id: "1", type: "paragraph", content: "", style: { textAlign: "left" } },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [activeTemplate, setActiveTemplate] = useState("minimal");
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selection, setSelection] = useState({
    blockId: null,
    start: 0,
    end: 0,
  });

  const textareaRefs = useRef({});
  const fileInputRef = useRef();

  // Fetch existing blog data if slug exists
  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/blog/${slug}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch blog");

        const data = await response.json();
        setTitle(data.title);
        setBlocks(data.blocks);
        if (data.template) {
          setSelectedTemplate(data.template);
          setActiveTemplate(data.template);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        swal({
          title: "Error",
          text: "Failed to load blog. Please try again.",
          icon: "error",
          button: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const getBlockStyle = (type) => {
    switch (type) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "h3":
        return styles.h3;
      default:
        return styles.paragraph;
    }
  };

  const wrapTextWithTag = (text, start, end, tag) => {
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const hasTag =
      selected.startsWith(`<${tag}>`) && selected.endsWith(`</${tag}>`);

    if (hasTag) {
      const unwrapped = selected.substring(
        tag.length + 2,
        selected.length - (tag.length + 3)
      );
      return before + unwrapped + after;
    } else {
      return before + `<${tag}>` + selected + `</${tag}>` + after;
    }
  };

  const createNewBlock = useCallback(
    (type = "paragraph", content = "", additionalProps = {}) => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        style: { textAlign: "left" },
        ...additionalProps,
      };
    },
    []
  );

  const deleteBlock = useCallback(
    (index) => {
      if (blocks.length > 1) {
        setBlocks((blocks) => blocks.filter((_, i) => i !== index));
      }
    },
    [blocks.length]
  );

  const updateBlockContent = useCallback((index, content) => {
    setBlocks((blocks) =>
      blocks.map((block, i) => (i === index ? { ...block, content } : block))
    );
  }, []);

  const updateBlockType = useCallback((index, type) => {
    setBlocks((blocks) =>
      blocks.map((block, i) => (i === index ? { ...block, type } : block))
    );
  }, []);

  const applyStyle = useCallback(
    (index, styleType, cssStyle = null) => {
      const block = blocks[index];
      const textarea = textareaRefs.current[block.id];

      if (cssStyle) {
        setBlocks((blocks) =>
          blocks.map((block, i) =>
            i === index
              ? { ...block, style: { ...block.style, ...cssStyle } }
              : block
          )
        );
      } else if (textarea && selection.start !== selection.end) {
        let tag;
        switch (styleType) {
          case "bold":
            tag = "b";
            break;
          case "italic":
            tag = "i";
            break;
          case "underline":
            tag = "u";
            break;
          case "quote":
            tag = "q";
            break;
          default:
            return;
        }

        const newContent = wrapTextWithTag(
          block.content,
          selection.start,
          selection.end,
          tag
        );

        setBlocks((blocks) =>
          blocks.map((b, i) =>
            i === index ? { ...b, content: newContent } : b
          )
        );

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(selection.start, selection.end);
        }, 0);
      }
    },
    [blocks, selection]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setBlocks((blocks) => {
          const newBlocks = [...blocks];
          newBlocks.splice(index + 1, 0, createNewBlock());
          return newBlocks;
        });

        setTimeout(() => {
          const newBlockRef = textareaRefs.current[blocks[index + 1]?.id];
          if (newBlockRef) {
            newBlockRef.focus();
          }
        }, 0);
      } else if (
        e.key === "Backspace" &&
        !blocks[index].content &&
        blocks.length > 1
      ) {
        e.preventDefault();
        deleteBlock(index);
        setTimeout(() => {
          const prevBlockRef = textareaRefs.current[blocks[index - 1]?.id];
          if (prevBlockRef) {
            prevBlockRef.focus();
          }
        }, 0);
      }
    },
    [blocks, createNewBlock, deleteBlock]
  );

  const handleSelectionChange = useCallback((blockId) => {
    const textarea = textareaRefs.current[blockId];
    if (textarea) {
      setSelection({
        blockId,
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      });
    }
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData) => {
      if (activeBlockId) {
        const blockIndex = blocks.findIndex(
          (block) => block.id === activeBlockId
        );
        if (blockIndex !== -1) {
          const textareaRef = textareaRefs.current[activeBlockId];
          if (textareaRef) {
            const start = textareaRef.selectionStart;
            const end = textareaRef.selectionEnd;
            const text = blocks[blockIndex].content;
            const newText =
              text.substring(0, start) + emojiData.emoji + text.substring(end);
            updateBlockContent(blockIndex, newText);

            setTimeout(() => {
              textareaRef.selectionStart = start + emojiData.emoji.length;
              textareaRef.selectionEnd = start + emojiData.emoji.length;
              textareaRef.focus();
            }, 0);
          }
        }
      }
      setShowEmojiPicker(false);
    },
    [activeBlockId, blocks, updateBlockContent]
  );

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate image
      const errors = validateImage(file);
      if (errors.length > 0) {
        swal({
          title: "Error",
          text: errors.join("\n"),
          icon: "error",
          button: "OK",
        });
        return;
      }

      try {
        // Show loading state
        const loadingToast = swal({
          title: "Processing",
          text: "Resizing and uploading image...",
          icon: "info",
          buttons: false,
          closeOnClickOutside: false,
        });

        // Resize image before upload
        const resizedBlob = await resizeImage(file);
        const resizedFile = new File([resizedBlob], file.name, {
          type: resizedBlob.type,
        });

        const formData = new FormData();
        formData.append("image", resizedFile);

        const response = await fetch(
          "http://localhost:3000/blog/upload-image",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 413
              ? "Image is still too large. Please try a smaller image."
              : "Image upload failed"
          );
        }

        const data = await response.json();

        // Close loading toast
        swal.close();

        const imageBlock = createNewBlock("image", "", {
          imageUrl: data.imageUrl,
          alt: file.name,
        });

        const currentIndex = activeBlockId
          ? blocks.findIndex((block) => block.id === activeBlockId)
          : blocks.length - 1;

        setBlocks((blocks) => {
          const newBlocks = [...blocks];
          newBlocks.splice(currentIndex + 1, 0, imageBlock);
          return newBlocks;
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        swal({
          title: "Error",
          text: error.message || "Failed to upload image. Please try again.",
          icon: "error",
          button: "OK",
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [activeBlockId, blocks, createNewBlock]
  );

  const onSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    setActiveTemplate(templateId);
  };

  const onUpdateBlogTemplate = async (templateId) => {
    try {
      // Only make the API call if we have a slug (existing blog)
      if (slug) {
        const response = await fetch(
          `http://localhost:3000/blog/${slug}/template`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              template: templateId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update template");
        }

        setActiveTemplate(templateId);
        swal({
          title: "Success",
          text: "Blog template updated successfully!",
          icon: "success",
          button: "OK",
        });
      } else {
        // If it's a new blog, just update the state
        setActiveTemplate(templateId);
      }
    } catch (error) {
      console.error("Error updating template:", error);
      swal({
        title: "Error",
        text: "Failed to update template. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const adjustTextareaHeight = useCallback((textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      swal({
        title: "Error",
        text: "Please add a title to your blog",
        icon: "error",
        button: "OK",
      });
      return;
    }

    if (blocks.every((block) => !block.content && block.type !== "image")) {
      swal({
        title: "Error",
        text: "Please add some content to your blog",
        icon: "error",
        button: "OK",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = slug
        ? `http://localhost:3000/blog/${slug}/update`
        : "http://localhost:3000/blog/save";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          blocks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog");
      }

      const data = await response.json();

      swal({
        title: "Success",
        text: "Blog saved successfully!",
        icon: "success",
        button: "OK",
      }).then(() => {
        navigate(`/blog/${data.slug}`);
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      swal({
        title: "Error",
        text: "Failed to save blog. Please try again.",
        icon: "error",
        button: "OK",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderBlock = useCallback(
    (block, index) => {
      switch (block.type) {
        case "image":
          return (
            <div className={styles.imageBlock} style={block.style}>
              <img
                src={block.imageUrl}
                alt={block.alt}
                className={styles.uploadedImage}
                loading="lazy"
              />
            </div>
          );
        default:
          return (
            <textarea
              ref={(el) => {
                textareaRefs.current[block.id] = el;
                if (el) adjustTextareaHeight(el);
              }}
              value={block.content}
              onChange={(e) => {
                updateBlockContent(index, e.target.value);
                adjustTextareaHeight(e.target);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActiveBlockId(block.id)}
              onBlur={() => setActiveBlockId(null)}
              onSelect={() => handleSelectionChange(block.id)}
              className={`${styles.textarea} ${getBlockStyle(block.type)}`}
              style={{
                ...block.style,
                minHeight: "1.5em",
              }}
              placeholder={
                index === 0 && block.type === "paragraph"
                  ? "Start writing..."
                  : ""
              }
              rows={1}
            />
          );
      }
    },
    [
      adjustTextareaHeight,
      handleKeyDown,
      updateBlockContent,
      handleSelectionChange,
    ]
  );
  const handlePublish = async ({ isPublic }) => {
    try {
      const response = await fetch("http://localhost:3000/blog/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          blocks,
          template: activeTemplate, // Use activeTemplate instead of selectedTemplate
          isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish blog");
      }

      const data = await response.json();
      setPublishedUrl(data.url);
      setIsPublished(true);

      swal({
        title: "Success",
        text: `Blog published successfully at ${data.url}!`,
        icon: "success",
        button: "OK",
      });
    } catch (error) {
      console.error("Error publishing blog:", error);
      swal({
        title: "Error",
        text: "Failed to publish blog. Please try again.",
        icon: "error",
        button: "OK",
      });
    }
  };
  const renderPreview = () => {
    return (
      <div className={styles.preview}>
        <h1 className={styles.previewTitle}>{title}</h1>
        <div className={styles.previewContent}>
          {blocks.map((block) => {
            switch (block.type) {
              case "image":
                return (
                  <div key={block.id} style={block.style}>
                    <img
                      src={block.imageUrl}
                      alt={block.alt}
                      className={styles.previewImage}
                      loading="lazy"
                    />
                  </div>
                );
              case "h1":
                return (
                  <h1
                    key={block.id}
                    style={block.style}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                );
              case "h2":
                return (
                  <h2
                    key={block.id}
                    style={block.style}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                );
              case "h3":
                return (
                  <h3
                    key={block.id}
                    style={block.style}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                );
              default:
                return (
                  <p
                    key={block.id}
                    style={block.style}
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                );
            }
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.topBar}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          className={styles.titleInput}
        />
        <div className={styles.topBarButtons}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`${styles.previewButton} ${
              showPreview ? styles.active : ""
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            <Save size={16} className={styles.saveIcon} />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div
        className={`${styles.editorPreviewContainer} ${
          showPreview ? styles.withPreview : ""
        }`}
      >
        <div className={styles.editor}>
          <div className={styles.blocksContainer}>
            {blocks.map((block, index) => (
              <div key={block.id} className={styles.block}>
                <div className={styles.blockControls}>
                  <select
                    value={block.type}
                    onChange={(e) => updateBlockType(index, e.target.value)}
                    className={styles.blockTypeSelect}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                  <div className={styles.formatButtons}>
                    <button
                      onClick={() => applyStyle(index, "bold")}
                      className={`${styles.formatButton}`}
                      disabled={
                        !selection.blockId || selection.start === selection.end
                      }
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onClick={() => applyStyle(index, "italic")}
                      className={`${styles.formatButton}`}
                      disabled={
                        !selection.blockId || selection.start === selection.end
                      }
                    >
                      <Italic size={16} />
                    </button>
                    <button
                      onClick={() => applyStyle(index, "underline")}
                      className={`${styles.formatButton}`}
                      disabled={
                        !selection.blockId || selection.start === selection.end
                      }
                    >
                      <Underline size={16} />
                    </button>
                    <button
                      onClick={() => applyStyle(index, "quote")}
                      className={`${styles.formatButton} ${styles.quote}`}
                      disabled={
                        !selection.blockId || selection.start === selection.end
                      }
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                  <div className={styles.alignButtons}>
                    <button
                      onClick={() =>
                        applyStyle(index, null, { textAlign: "left" })
                      }
                      className={`${styles.alignButton} ${
                        block.style.textAlign === "left" ? styles.active : ""
                      }`}
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        applyStyle(index, null, { textAlign: "center" })
                      }
                      className={`${styles.alignButton} ${
                        block.style.textAlign === "center" ? styles.active : ""
                      }`}
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      onClick={() =>
                        applyStyle(index, null, { textAlign: "right" })
                      }
                      className={`${styles.alignButton} ${
                        block.style.textAlign === "right" ? styles.active : ""
                      }`}
                    >
                      <AlignRight size={16} />
                    </button>
                  </div>
                  <div className={styles.mediaButtons}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.mediaButton}
                      title="Upload image"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`${styles.mediaButton} ${
                        showEmojiPicker ? styles.active : ""
                      }`}
                      title="Insert emoji"
                    >
                      <Smile size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => deleteBlock(index)}
                    className={`${styles.deleteButton} ${
                      blocks.length === 1 ? styles.disabled : ""
                    }`}
                    disabled={blocks.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {renderBlock(block, index)}
              </div>
            ))}
          </div>

          {showEmojiPicker && (
            <div className={styles.emojiPickerWrapper}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {showPreview && (
          <div className={styles.previewContainer}>{renderPreview()}</div>
        )}
      </div>
      <div className={styles.publishSection}>
        <h2 className={styles.sectionTitle}>Choose a Template</h2>
        <TemplateSelector
          selectedTemplate={activeTemplate}
          onSelectTemplate={onSelectTemplate}
          onUpdateBlogTemplate={onUpdateBlogTemplate}
        />

        <h2 className={styles.sectionTitle}>Publishing Settings</h2>
        <PublishSettings onPublish={handlePublish} />

        {isPublished && (
          <div className={styles.publishedInfo}>
            <p>
              Your blog is published at:{" "}
              <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                {publishedUrl}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
