import FileCopyIcon from '@mui/icons-material/FileCopy';
import InputAdornment from '@mui/material/InputAdornment';
import { MiradorMenuButton } from 'mirador/dist/es/src/components/MiradorMenuButton';
import React from 'react';
import PropTypes from 'prop-types';

/** Renders the button for copying the image url to the clipboard */
const CopyToClipboard = ({ onCopy, supported, t }) => {
  if (!supported) {
    return null;
  }
  return (
    <InputAdornment>
      <MiradorMenuButton aria-label={t('imageCropper.copyToClipboard')} edge="end" onClick={onCopy}>
        <FileCopyIcon fontSize="small" />
      </MiradorMenuButton>
    </InputAdornment>
  );
};

CopyToClipboard.propTypes = {
  onCopy: PropTypes.func.isRequired,
  supported: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default CopyToClipboard;
