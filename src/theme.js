import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "#fffffa",
          },
          "& .MuiInputLabel-root": {
            color: "#fffffa",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "#fffffa",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#fffffa",
        },
        notchedOutline: {
          borderWidth: "2px",
          borderColor: "#fffffa",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fffffa",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#fffffa",
        },
      },
    },
  },
});

export default theme;
