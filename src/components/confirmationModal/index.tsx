import React from 'react';
import { createRoot } from 'react-dom/client';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './styles.css';
import {Button} from '../buttons/simpleButton';

export interface ConfirmationModalProps {
  title: string;
  content: string;
  buttonText: string;
  onAction?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  content,
  buttonText,
  onAction,
  onCancel,
  showCancelButton = true,
}) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-dialog">
        <div className="confirmation-modal-icon-container">
          <InfoOutlinedIcon className="confirmation-modal-icon" />
        </div>
        <div className="confirmation-modal-title">{title}</div>
        <div className="confirmation-modal-content">{content}</div>
        <div className="confirmation-modal-buttons">
          <Button
            label={buttonText}
            onClick={onAction}
            className="confirmation-modal-primary-button"
          />
          {showCancelButton && (
            <Button
              label="Cancelar"
              onClick={onCancel}
              className="confirmation-modal-secondary-button"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Static method to show modal
export function showConfirmationModal(props: ConfirmationModalProps) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const remove = () => {
    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 200);
  };
  const handleAction = () => {
    remove();
    if (props.onAction) props.onAction();
  };

  root.render(
    <ConfirmationModal
      {...props}
      onAction={handleAction}
      onCancel={remove}
    />
  );
}

export default ConfirmationModal;
