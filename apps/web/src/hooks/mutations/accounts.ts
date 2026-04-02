import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAccount, deleteAccount, putAccount, setRecentAccount } from "../../api/accounts"

export function useCreateAccountMutation(func?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["accounts"]})
            func?.()
        }
    })
}

export function useDeleteAccountMutation(func?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] })
            func?.()
        },
    })
}

export function useUpdateAccountMutation(func?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: putAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["accounts"]})
            func?.()
        }
    })
}

export function useSetRecentAccountMutation(func?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: setRecentAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["recent_account"]})
            func?.()
        }
    })
}