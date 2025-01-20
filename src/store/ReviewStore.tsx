import { create } from "zustand";
import { StateType, BookReviewType } from "../types";
import axios from "axios";
import { useAuthState } from "./AuthStore";
import { getStateDefaultObject } from "../utils/baseListState";

type StoreType = StateType<BookReviewType>;

export const useUserState = create<StateType<BookReviewType>>((set) => ({
    ...getStateDefaultObject(set, (i) => i.id),
}));

export const useGlobalState = create<StateType<BookReviewType>>((set) => ({
    ...getStateDefaultObject(set, (i) => i.id),
}));

const useReveiwActions = (store: StoreType) => {
    const {
        quickInsert,
        quickUpdate,
        quickDelete,
        setLoading,
        setPagination,
        setItems,
        ...state
    } = store;

    const { user } = useAuthState();

    const fetchMoreItems = async (id?: string) => {
        const { currentPage, limit, hasMore } = store;

        if (!hasMore) return;

        setLoading(true);

        try {
            const res = await axios.get("/book-review", {
                params: { page: currentPage, limit, id },
            });

            const { reviews, total } = res.data;
            setItems([...store.items, ...reviews]);
            setPagination(currentPage + 1, total > currentPage * limit);
        } catch (error) {
            console.error("Error fetching more items:", error);
        } finally {
            setLoading(false);
        }
    };

    const insertItem = async (item: Partial<BookReviewType>) => {
        try {
            const res = await axios.post("/book-review", item);

            const review = {
                ...res.data.review,
                reviewer: {
                    _id: user?.id,
                    username: user?.username,
                    email: user?.email,
                },
            };
            quickInsert(review);
            return review;
        } catch (error) {
            console.error("Error inserting item:", error);
            throw error;
        }
    };

    const updateItem = async (id: string, item: Partial<BookReviewType>) => {
        try {
            await axios.patch(`/book-review/${id}`, item);
            quickUpdate(id, item);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            await axios.delete(`/book-review/${id}`);
            quickDelete(id);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return {
        ...state,
        fetchMoreItems,
        insertItem,
        updateItem,
        deleteItem,
        quickDelete,
        quickUpdate,
        quickInsert,
    };
};

export const useUserReviewStore = () => {
    return useReveiwActions(useUserState());
};

export const useGlobalReviewStore = () => {
    return useReveiwActions(useGlobalState());
};
