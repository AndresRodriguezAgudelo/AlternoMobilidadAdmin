import React from 'react';
import './styles.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="button">
      <div className={`modal-content ${className ?? ''}`} onClick={e => e.stopPropagation()} role="button">
        {title !== '' && (
          <div className="modal-header">
            <h2>{title}</h2>
          </div>
        )}
        <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">×</button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
