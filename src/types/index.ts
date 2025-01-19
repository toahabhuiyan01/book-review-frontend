export type UserLoginRegisterType = {
    email: string;
    username: string;
    password: string;
};

export type IUser = {
    id: string;
    email: string;
    username: string;
    avatar?: string;
};

export type BookReviewType = {
    id: string;
    rating: number;
    reviewText: string;
    createdAt: Date | string;
    bookTitle: string;
    bookAuthor: string;
    reviewer: {
        _id: string;
        username: string;
        avatar?: string;
    };
};

export type StateType<T> = {
    items: T[];
    currentPage: number;
    limit: number;
    loading: boolean;
    hasMore: boolean;
    totalCount?: number;
    quickInsert: (item: T) => void;
    quickDelete: (id: string) => void;
    quickUpdate: (id: string, item: Partial<T>) => void;
    setLoading: (loading: boolean) => void;
    setPagination: (currentPage: number, hasMore: boolean) => void;
    setItems: (items: T[]) => void;
};

export type SetStateInternal<T> = {
    _(
        partial:
            | T
            | Partial<T>
            | {
                  _(state: T): T | Partial<T>;
              }["_"],
        replace?: false
    ): void;
    _(
        state:
            | T
            | {
                  _(state: T): T;
              }["_"],
        replace: true
    ): void;
}["_"];
