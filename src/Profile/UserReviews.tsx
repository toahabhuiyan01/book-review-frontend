import { useReviewStoreUser } from "../store/ReviewStore";
import { useEffect } from "react";
import useAuthStore from "../store/AuthStore";
import RenderComments from "../components/RenderReviews";

export default function UserReviews() {
    const { jwtUser: user } = useAuthStore();
    const { fetchMoreItems, items, hasMore, loading } = useReviewStoreUser();

    useEffect(() => {
        fetchMoreItems(user?.id);
    }, []);

    return (
        <RenderComments
            state={{
                reviews: items,
                fetchMore: () => fetchMoreItems(user?.id),
                hasMore,
                loading,
            }}
        />
    );
}
