import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import './styles.css';

interface VerifyIconProps {
  verified: boolean;
}

export const VerifyIcon: React.FC<VerifyIconProps> = ({ verified }) => {
  return (
    <div className={`verify-icon ${verified ? 'verified' : 'unverified'}`}>
      {verified ? <CheckIcon /> : 'i'}
    </div>
  );
};
