import {
    Avatar,
    Box,
    CircularProgress,
    Grid2 as Grid,
    Typography,
} from "@mui/material";
import UserDefaultImage from "../assets/user-avatar.png";
import useAuthStore from "../store/AuthStore";
import useAlertStore from "../store/AlertStore";
import Editable from "../components/Editable";
import { Upload } from "lucide-react";

export default function UserProfile() {
    const { user, patchUserData, loading } = useAuthStore();
    const { setAlert } = useAlertStore();

    if (loading) {
        return (
            <Grid
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
                p={4}
            >
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <Grid
            px={3}
            py={5}
            gap={2}
            display="flex"
            flexDirection={{
                xs: "column",
                sm: "row",
            }}
            alignItems="center"
            justifyContent="center"
            boxShadow="0 1px 0px 0px red"
        >
            <Grid
                id="image-container"
                position="relative"
                sx={{
                    display: "none",
                    ":hover": {
                        "& .MuiBox-root": {
                            display: "flex",
                        },
                    },
                }}
            >
                <Avatar
                    alt="Profile Picture"
                    id="profile-picture"
                    src={user?.avatar || UserDefaultImage}
                    style={{
                        height: "150px",
                        width: "150px",
                    }}
                />

                <Box
                    display="none"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    flexDirection="column"
                    top="4rem"
                    left="2rem"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                        document.getElementById("file-input")?.click()
                    }
                >
                    <Upload />
                    <Typography variant="caption">
                        {user?.avatar ? "Change" : "Add"} Picture
                    </Typography>
                </Box>

                <input
                    accept=".jpg, .png, .bmp"
                    id="file-input"
                    name="avatar"
                    style={{ display: "none" }}
                    onChange={(event) => {
                        const file = event.target.files![0];
                        if (!file) {
                            return;
                        }

                        const urlData = URL.createObjectURL(file);
                        try {
                            const reader = new FileReader();

                            reader.onload = (e) => {
                                const img = new Image();
                                img.src = urlData;

                                img.onload = () => {
                                    if (img.width > 1024 || img.height > 1024) {
                                        setAlert(
                                            "Image must be below 1024x1024",
                                            "error"
                                        );

                                        return;
                                    }

                                    patchUserData({
                                        avatar: e.target!.result as string,
                                    });
                                };
                            };

                            reader.readAsDataURL(file);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    type="file"
                />
            </Grid>
            <Grid gap={3} display="flex" flexDirection="column">
                <Editable
                    text={user?.username || ""}
                    onChange={(value) => patchUserData({ username: value })}
                    textFieldProps={{
                        name: "username",
                        type: "text",
                        placeholder: "Enter your username",
                    }}
                    typographyProps={{
                        variant: "h3",
                        align: "center",
                        className: "source-code-bold",
                    }}
                />

                <Editable
                    text={user?.email || ""}
                    onChange={(value) => patchUserData({ email: value })}
                    textFieldProps={{
                        name: "email",
                        type: "email",
                        placeholder: "youremail@mail.com",
                        autoComplete: "email",
                    }}
                    typographyProps={{
                        variant: "subtitle1",
                        align: "center",
                        className: "source-code-regular",
                    }}
                />
            </Grid>
        </Grid>
    );
}
