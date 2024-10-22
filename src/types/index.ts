export type UserLoginRegisterType = {
    email: string
    username: string
    password: string
}

export type IUser = {
    id: string
    email: string
    username: string
    avatar?: string
}

export type BookReviewType = {
    id: string;
    rating: number
    reviewText: string;
    createdAt: Date | string;
    bookTitle: string;
    bookAuthor: string;
    reviewer: {
        _id: string
        username: string
        avatar?: string
    }
}

export type StoreType<T> = {
    items: T[]
    currentPage: number
    limit: number
    loading: boolean
    hasMore: boolean
    totalCount?: number
    insert: (item: Partial<T>) => Promise<T>
    delete: (id: string) => Promise<void>
    update: (id: string, item: Partial<T>) => Promise<void>
    quickInsert: (item: T) => void
    quickDelete: (id: string) => void
    quickUpdate: (id: string, item: Partial<T>) => void
    fetchMoreItems: (id?: string) => Promise<void>
}

export type SetStateInternal<T> = {
    _(partial: T | Partial<T> | {
        _(state: T): T | Partial<T>;
    }['_'], replace?: false): void;
    _(state: T | {
        _(state: T): T;
    }['_'], replace: true): void;
}['_'];