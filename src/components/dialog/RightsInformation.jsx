import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/** Renders the rights information defined in the used manifest */
const RightsInformation = ({ rights }) => {
  const { t } = useTranslation();
  if (!rights.length) {
    return null;
  }
  return (
    <Alert severity="warning" sx={{ mt: 2 }}>
      <span>{t("imageCropper.noteRights", { count: rights.length })}: </span>
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
    </Alert>
  );
};

RightsInformation.propTypes = {
  rights: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RightsInformation;
