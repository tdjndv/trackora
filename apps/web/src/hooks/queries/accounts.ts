import {useQuery, keepPreviousData } from '@tanstack/react-query'
import { getRecentAccount, listAccounts } from '../../api/accounts'

export function useAccountsQuery(input?: {name?: string, type?: string, currency?: string}) {
    return useQuery({
        queryKey: ["accounts", input],
        queryFn: () => listAccounts(input),
        placeholderData: keepPreviousData
    })
}

export function useRecentAccountQuery() {
    return useQuery({
        queryKey: ["recent_account"],
        queryFn: getRecentAccount,
    })
}