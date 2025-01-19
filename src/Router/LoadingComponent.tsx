import { CircularProgress, Grid2 as Grid } from "@mui/material";

export default function LoadingComponent() {
    return (
        <Grid
            height="100vh"
            width="100%"
            bgcolor="background.default"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <CircularProgress size={40} />
        </Grid>
    );
}
