import React from 'react';
import { templates } from './blogTemplates';
import styles from './TemplateSelector.module.css';

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div className={styles.templateGrid}>
      {templates.map(template => (
        <div 
          key={template.id}
          className={`${styles.templateCard} ${
            selectedTemplate === template.id ? styles.selected : ''
          }`}
          onClick={() => onSelectTemplate(template.id)}
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
