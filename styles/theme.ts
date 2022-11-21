import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily:
            "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;",
    },
    palette: {
        primary: {
            main: "#FFFE71",
        },
        secondary: {
            main: "#2d4249",
        },
        info: {
            main: "#DDDDDD",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: "black",
                },
            },
        },
    },
});

export default theme;
