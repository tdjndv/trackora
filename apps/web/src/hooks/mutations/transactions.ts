import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction, deleteTransaction, putTransaction } from "../../api/transactions";

export function useUpdateTransactionMutation(success?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: putTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
            success?.()
        }
    })
}

export function useDeleteTransactionMutation(success?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
            success?.()
        }
    })
}

export function useCreateTransactionMutation(success?: () => void, failed?: (error: any) => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]})
            success?.()
        },
        onError: failed
    })
}