import { Global, css } from "@emotion/react";

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        margin: 0;
        background: black;
        min-height: 100vh;
        width: 100vw;
        font-family: Helvetica, Arial, sans-serif;
        font-family: Hack, monospace;
        font-size: 24px;
      }

      .Toastify__toast-container {
        font-size: 16px;
      }
    `}
  />
);

export const colors = {
  blue: `#51EAEA`,
  lightOrange: `#FFDBC5`,
  orange: `#FF9D76`,
  red: `#EF4339`,
};
