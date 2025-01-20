import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid2 as Grid,
    Rating,
    Typography,
} from "@mui/material";
import { BookReviewType } from "../types";
import AddEditReview from "./AddEditReview";
import useAuthStore from "../store/AuthStore";
import { Trash } from "lucide-react";
import { useState } from "react";
import useAlertStore from "../store/AlertStore";
import { useGlobalReviewStore, useUserReviewStore } from "../store/ReviewStore";

type RenderReviewsProps = {
    state: {
        reviews: BookReviewType[];
        fetchMore: () => void;
        hasMore: boolean;
        loading: boolean;
    };
};

export default function RenderReviews({
    state: { reviews, fetchMore, hasMore, loading },
}: RenderReviewsProps) {
    if (reviews.length === 0 && !loading) {
        return (
            <Grid py={2} textAlign="center">
                No reviews yet
            </Grid>
        );
    }

    return (
        <Grid mb={3}>
            {reviews.map((review) => (
                <RenderReview key={review.id} review={review} />
            ))}
            <Button
                fullWidth
                onClick={() => fetchMore()}
                disabled={!hasMore || loading}
            >
                {!!loading && <CircularProgress size={20} />}
                Load More
            </Button>
        </Grid>
    );
}

function RenderReview({ review }: { review: BookReviewType }) {
    const { jwtUser } = useAuthStore();
    const { setAlert } = useAlertStore();
    const { updateItem, deleteItem } = useUserReviewStore();
    const { quickDelete, quickUpdate } = useGlobalReviewStore();
    const [showConfirmation, setShowConfirmation] = useState(false);

    return (
        <Grid
            display="flex"
            flexDirection="row"
            gap={6}
            py={3}
            position="relative"
        >
            <Dialog
                maxWidth="xs"
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
            >
                <DialogTitle>
                    Are Sure You Want To Delete This Review?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setShowConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        onClick={async () => {
                            await deleteItem(review.id);
                            quickDelete(review.id);

                            setAlert("Review Deleted", "success");
                            setShowConfirmation(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                gap={4}
                minWidth={{ xs: "9rem", md: "21rem" }}
            >
                <Grid
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    minWidth="9rem"
                    gap={1}
                >
                    <Typography
                        variant="caption"
                        color="red"
                        sx={{ width: "100%", textAlign: "end" }}
                        boxShadow="0 1px 0px 0px red"
                    >
                        Book
                    </Typography>
                    <Grid
                        display="flex"
                        flexDirection="column"
                        alignItems="end"
                    >
                        <Typography variant="subtitle2" textAlign="end">
                            {review.bookTitle}
                        </Typography>
                        <Typography variant="caption" textAlign="end">
                            {review.bookAuthor}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    minWidth="9rem"
                    gap={1}
                >
                    <Typography
                        variant="caption"
                        color="red"
                        sx={{ width: "100%", textAlign: "end" }}
                        boxShadow="0 1px 0px 0px red"
                    >
                        Rave
                    </Typography>

                    <Grid
                        display="flex"
                        flexDirection="column"
                        alignItems="end"
                    >
                        <Typography variant="subtitle2">
                            {review.reviewer.username}
                        </Typography>
                        <Rating
                            sx={{ fontSize: "1rem" }}
                            value={review.rating}
                            readOnly
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Typography className="quoted-paragraph" position="relative">
                {review.reviewText}
            </Typography>
            {jwtUser?.id === review.reviewer._id && (
                <Grid position="absolute" right={0} top={10} display="flex">
                    <AddEditReview
                        review={review}
                        onSave={async (rev) => {
                            await updateItem(review.id, rev!);
                            quickUpdate(review.id, rev!);
                        }}
                    />
                    <Button
                        onClick={() => setShowConfirmation(true)}
                        color="error"
                    >
                        <Trash size={16} />
                    </Button>
                </Grid>
            )}
        </Grid>
    );
}
