import React from 'react';
import { templates } from './blogTemplates';
import styles from './TemplateSelector.module.css';

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate, onUpdateBlogTemplate }) => {
  const handleTemplateSelect = (templateId) => {
    onSelectTemplate(templateId);
    // Call the function to update the blog with the selected template
    onUpdateBlogTemplate(templateId);
  };

  return (
    <div className={styles.templateGrid}>
      {templates.map(template => (
        <div 
          key={template.id}
          className={`${styles.templateCard} ${
            selectedTemplate === template.id ? styles.selected : ''
          }`}
          onClick={() => handleTemplateSelect(template.id)}
        >
          <img 
            src={template.preview} 
            alt={template.name} 
            className={styles.templatePreview}
          />
          <h3 className={styles.templateName}>{template.name}</h3>
        </div>
      ))}
    </div>
  );
};
