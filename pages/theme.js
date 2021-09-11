import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { palette } from "@material-ui/system";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF4500",
      success: "#4AC860",
    },
    secondary: {
      main: "#fff",
    },
    error: {
      main: "#FB5E5E",
    },
    dark: {
      main: "#1B1C24",
    },

    background: {
      default: "#fff",
    },
  },
});

export default theme;
