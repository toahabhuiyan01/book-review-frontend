import { Grid2 as Grid, Typography } from "@mui/material";
import UserProfile from "./UserProfile";
import AddEditReview from "../components/AddEditReview";
import UserReviews from "./UserReviews";
import { useGlobalReviewStore, useUserReviewStore } from "../store/ReviewStore";

export default function Profile() {
    const { insert } = useUserReviewStore()
    const { quickInsert, items, hasMore } = useGlobalReviewStore()
    return (
        <Grid
            display='flex'
            flexDirection='column'
        >
            <UserProfile />
            <Grid
                py={1}
                px={3}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                boxShadow='0 1px 0px 0px black'
            >
                <Typography
                    className='source-code-regular'
                    variant='h5'
                >
                    My Reviews
                </Typography>
                <AddEditReview
                    onSave={async (user) => {
                        const review = await insert(user!)
                        if(!hasMore || items.length) {
                            quickInsert(review)
                        }
                    }}
                />
            </Grid>
            <UserReviews />
        </Grid>
    )
}