import {useQuery, keepPreviousData } from '@tanstack/react-query'
import { getRecentAccount, listAccounts } from '../../api/accounts'
import { useAppSelector } from '../../app/hooks'

export function useAccountsQuery(input?: {name?: string, type?: string, currency?: string}) {
    const {user, initialized} = useAppSelector((state) => state.auth)
    return useQuery({
        queryKey: ["accounts", input],
        queryFn: () => listAccounts(input),
        placeholderData: keepPreviousData,
        enabled: initialized && !!user,
        retry: false
    })
}

export function useRecentAccountQuery() {
    const {user, initialized} = useAppSelector((state) => state.auth)
    return useQuery({
        queryKey: ["recent_account"],
        queryFn: getRecentAccount,
        enabled: initialized && !!user,
        retry: false
    })
}