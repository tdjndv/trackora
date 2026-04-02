import { useQuery } from "@tanstack/react-query";
import { listTransactions } from "../../api/transactions";

export function useTransactionsQuery(params?: {account_id?: string, from?: string, to?: string, page?: string, limit?: string, note?: string, category?: string, min_amount?: string, max_amount?: string}) {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: () => listTransactions(params),
        placeholderData: (prev) => prev
    })
}

