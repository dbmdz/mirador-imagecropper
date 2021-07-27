import FacebookIcon from "@material-ui/icons/Facebook";
import MailIcon from "@material-ui/icons/Mail";
import PinterestIcon from "@material-ui/icons/Pinterest";
import TwitterIcon from "@material-ui/icons/Twitter";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React from "react";

import { getShareLink } from "../utils";

const iconMapping = {
  envelope: MailIcon,
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsAppIcon,
};

const ShareButton = ({
  attribution,
  imageUrl,
  label,
  provider,
  thumbnailUrl,
  title,
}) => {
  const link = getShareLink(
    attribution,
    imageUrl,
    label,
    provider,
    thumbnailUrl
  );
  const ProviderIcon = iconMapping[provider];
  return (
    <MiradorMenuButton
      aria-label={title}
      href={encodeURI(link)}
      rel="noopener"
      target="_blank"
    >
      <ProviderIcon />
    </MiradorMenuButton>
  );
};

ShareButton.propTypes = {
  attribution: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

ShareButton.defaultProps = {
  attribution: undefined,
};

export default ShareButton;
