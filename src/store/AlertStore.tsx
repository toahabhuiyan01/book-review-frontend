import { create } from 'zustand'

type AlertStoreType = {
    alert?: {
        title?: string
        message: string
        type: 'success' | 'error'
        timeout?: number
    },
    setAlert: (message: string, type: 'success' | 'error', timeout?: number) => void
    clearAlert: () => void
}

const useAlertStore = create<AlertStoreType>((set) => ({
        setAlert: (message, type, timeout) => set({ alert: { message, type, timeout } }),
        clearAlert: () => set({ alert: undefined })
    })
)

export default useAlertStore