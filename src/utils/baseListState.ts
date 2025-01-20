import { SetStateInternal, StateType } from "../types";

type DefStoreType<T> = SetStateInternal<StateType<T>>;

export function getStateDefaultObject<T>(
    set: DefStoreType<T>,
    identifier: (item: T) => string
) {
    return {
        currentPage: 1,
        limit: 10,
        loading: false,
        hasMore: true,
        items: [],
        quickInsert: (item: T) => {
            set((state) => ({
                items: [item, ...state.items],
            }));
        },
        quickUpdate: (id: string, item: Partial<T>) => {
            set((state) => ({
                items: state.items.map((i) =>
                    identifier(i) === id ? { ...i, ...item } : i
                ),
            }));
        },
        quickDelete: (id: string) => {
            set((state) => ({
                items: state.items.filter((i) => identifier(i) !== id),
            }));
        },
        setLoading: (loading: boolean) => set({ loading }),
        setPagination: (currentPage: number, hasMore: boolean) =>
            set((state) => ({ ...state, currentPage, hasMore })),
        setItems: (items: T[]) => set({ items }),
    };
}
