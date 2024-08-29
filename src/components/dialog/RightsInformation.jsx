import React from 'react';

import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import PropTypes from 'prop-types';

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

/** Renders the rights information defined in the used manifest */
const RightsInformation = ({ rights, t }) => {
  if (!rights.length) {
    return null;
  }
  return (
    <StyledAlert severity="warning">
      <span>{t('imageCropper.noteRights', { count: rights.length })}: </span>
      {rights.length === 1 ? (
        <Link href={rights[0]} rel="noopener" target="_blank">
          {rights[0]}
        </Link>
      ) : (
        <ul>
          {rights.map((link) => (
            <li>
              <Link href={link} rel="noopener" target="_blank">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </StyledAlert>
  );
};

RightsInformation.propTypes = {
  rights: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
};

export default RightsInformation;
