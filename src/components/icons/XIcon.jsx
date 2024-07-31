import { SvgIcon } from "@material-ui/core";
import React from "react";

/* FIXME: should not be needed anymore when upgrading to MUI 5, see https://github.com/mui/material-ui/pull/38811 */
const XIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

export default XIcon;
