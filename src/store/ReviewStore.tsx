import { create } from "zustand";
import { StateType, BookReviewType, SetStateInternal } from "../types";
import axios from "axios";
import { useAuthState } from "./AuthStore";

type DefStoreType = {
    set: SetStateInternal<StateType<BookReviewType>>;
};

type StoreType = StateType<BookReviewType>;

const getStateDefaultObject = (set: DefStoreType["set"]) => ({
    currentPage: 1,
    limit: 10,
    loading: false,
    hasMore: true,
    items: [],
    quickInsert: (item: BookReviewType) => {
        set((state) => ({
            items: [item, ...state.items],
        }));
    },
    quickUpdate: (id: string, item: Partial<BookReviewType>) => {
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, ...item } : i
            ),
        }));
    },
    quickDelete: (id: string) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        }));
    },
    setLoading: (loading: boolean) => set({ loading }),
    setPagination: (currentPage: number, hasMore: boolean) =>
        set((state) => ({ ...state, currentPage, hasMore })),
    setItems: (items: BookReviewType[]) => set({ items }),
});

export const useUserState = create<StateType<BookReviewType>>((set) => ({
    ...getStateDefaultObject(set),
}));

export const useGlobalState = create<StateType<BookReviewType>>((set) => ({
    ...getStateDefaultObject(set),
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

export const useReviewStoreUser = () => {
    return useReveiwActions(useUserState());
};

export const useReviewStoreGlobal = () => {
    return useReveiwActions(useGlobalState());
};
