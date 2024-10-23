import { Grid2 as Grid, Typography } from "@mui/material";
import AddEditReview from "../components/AddEditReview";
import { useGlobalReviewStore, useUserReviewStore } from "../store/ReviewStore";
import { useEffect } from "react";
import RenderReviews from "../components/RenderReviews";

export default function Home() {
    const { fetchMoreItems, items, hasMore, loading, insert } = useGlobalReviewStore()
    const { quickInsert } =useUserReviewStore() 

    useEffect(() => {
        fetchMoreItems()
    }, [])

    return (
        <Grid>
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
                    Reviews Feed
                </Typography>
                <AddEditReview
                    onSave={async(values) => {
                        const review = await insert(values!)
                        if(!hasMore || items.length) {
                            quickInsert(review)
                        }
                    }}
                />
            </Grid>

            <RenderReviews
                state={{
                    reviews: items,
                    fetchMore: fetchMoreItems,
                    hasMore,
                    loading
                }}
            />
        </Grid>
    )
}