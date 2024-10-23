import { create,  } from 'zustand'
import { StoreType, BookReviewType, SetStateInternal } from '../types'
import axios from 'axios'

type DefStoreType = {
    get: () => StoreType<BookReviewType>
    set: SetStateInternal<StoreType<BookReviewType>>
}
const getStoreDefaultObject = (set: DefStoreType['set'], get: DefStoreType['get']) => ({
    currentPage: 1,
    limit: 10,
    loading: false,
    hasMore: true,
    items: [],
    insert: async (item: Partial<BookReviewType>) => {
        const res = await axios.post(
            '/book-review',
            item
        )

        const { quickInsert } = get()
        quickInsert(res.data.review)

        return res.data.review
    },
    update: async (id: string, item: Partial<BookReviewType>) => {
        await axios.patch(
            `/book-review/${id}`,
            item
        )

        const { quickUpdate } = get()
        quickUpdate(id, item)
    },
    delete: async (id: string) => {
        await axios.delete(`/book-review/${id}`)
        
        const { quickDelete } = get()
        quickDelete(id)
    },
    quickInsert: (item: BookReviewType) => {
        set(
            (state) => ({
                items: [item, ...state.items]
            })
        )
    },
    quickUpdate: (id: string, item: Partial<BookReviewType>) => {
        set(
            (state) => ({
                items: state.items.map((i) => i.id === id ? { ...i, ...item } : i)
            })
        )
    },
    quickDelete: (id: string) => {
        set(
            (state) => ({
                items: state.items.filter((i) => i.id !== id)
            })
        )
    },
    fetchMoreItems: async (id?: string) => {
        const { currentPage, hasMore, limit } = get()
        
        if(!hasMore) {
            return
        }
        
        set({ loading: true })
        const res = await axios.get(
            '/book-review', 
            {
                params: {
                    page: currentPage,
                    limit: limit,
                    id,
                }
            }
        )

        set(
            (state) => ({
                items: [...state.items, ...res.data.reviews],
                currentPage: (+state.currentPage) + 1,
                hasMore: res.data.total > currentPage * limit,
                loading: false
            })
        )
    }
})


// Could not implement Polymorphic State in zustand, which can be achieved in ContextAPI, so I had to use default value and type assertion

export const useUserReviewStore = create<StoreType<BookReviewType>>(
    (set, get) => ({ ...getStoreDefaultObject(set, get) })
)

export const useGlobalReviewStore = create<StoreType<BookReviewType>>(
    (set, get) => ({ ...getStoreDefaultObject(set, get) })
)