import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { listAccounts, createAccount, putAccount, deleteAccount, setDefaultAccount } from "../api/accounts"
import { useState } from "react"
import { CURRENCIES } from "../lib/currency"
import { stringToAccountType, type AccountType } from "../types/accounts"
import { ACCOUNT_TYPES } from "../types/accounts"
import { enumToString } from "../utils/general"
import LoadingPage from "./LoadingPage"

export default function AccountsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [filterName, setFilterName] = useState<string>("")
  const [filterType, setFilterType] = useState<AccountType | undefined>(undefined)
  const [filterCurrency, setFilterCurrency] = useState<string>("")

  const clearFilters = () => {
    setFilterName("")
    setFilterType(undefined)
    setFilterCurrency("")
  }

  const [createName, setCreateName] = useState<string>("")
  const [createType, setCreateType] = useState<AccountType | undefined>(undefined)
  const [createCurrency, setCreateCurrency] = useState<string>("")

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any | null>(null)

  const [editName, setEditName] = useState("")
  const [editType, setEditType] = useState<AccountType | undefined>(undefined)
  const [editCurrency, setEditCurrency] = useState("")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["accounts", { name: filterName, type: filterType, currency: filterCurrency }],
    queryFn: () => listAccounts({ name: filterName, type: filterType, currency: filterCurrency }),
    placeholderData: (previousData) => previousData,
  })

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      setCreateName("")
      setCreateType(undefined)
      setCreateCurrency("")
    },
  })

  const defaultMutation = useMutation({
    mutationFn: setDefaultAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["accounts"]})
    }
  })

  const updateMutation = useMutation({
    mutationFn: putAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      closeEdit()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createMutation.mutate({
      name: createName,
      type: createType as AccountType,
      currency: createCurrency,
    })
  }

  const openEdit = (account: any) => {
    setEditingAccount(account)
    setEditName(account.name)
    setEditType(account.type)
    setEditCurrency(account.currency)
    setIsEditOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
    setEditingAccount(null)
  }

  const goToTransactions = (account: any) => {
    navigate(`/transactions?account_id=${encodeURIComponent(account.id)}`)
  }

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingAccount?.id) return

    updateMutation.mutate({
      id: editingAccount.id,
      name: editName,
      type: editType,
      currency: editCurrency,
    })
  }

  const handleDelete = (account: any) => {
    if (!confirm(`Delete account "${account.name}"?`)) return
    deleteMutation.mutate({ id: account.id })
  }

  const handleDefault = (account: any) => {
    if (!confirm(`Set account "${account.name}" as default?`)) return
    defaultMutation.mutate({ account_id: account.id })
  }

  if (isLoading) return <LoadingPage />
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl p-6">
          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-700">Failed to load accounts</h2>
            <p className="mt-2 text-sm text-slate-600">{(error as any).message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
              Trackora
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Accounts
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your accounts and jump into transactions quickly.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200">
            Showing <span className="font-semibold text-slate-900">{data?.length ?? 0}</span> accounts
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Narrow accounts by name, type, and currency.
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="e.g. Main Checking"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <p className="mt-1 text-xs text-slate-500">Search by partial name</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(stringToAccountType(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {enumToString(t)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Currency</label>
              <select
                value={filterCurrency}
                onChange={(e) => {
                  setFilterCurrency(e.target.value)
                  console.log(filterCurrency)
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All</option>
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Create Account */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add a new account to start organizing your finances.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="create-name" className="block text-sm font-medium text-slate-700">
                Account Name
              </label>
              <input
                id="create-name"
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Main Checking"
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label htmlFor="create-type" className="block text-sm font-medium text-slate-700">
                Account Type
              </label>
              <select
                id="create-type"
                value={createType}
                onChange={(e) => setCreateType(stringToAccountType(e.target.value))}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select type</option>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {enumToString(t)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="create-currency" className="block text-sm font-medium text-slate-700">
                Currency
              </label>
              <select
                id="create-currency"
                value={createCurrency}
                onChange={(e) => setCreateCurrency(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select currency</option>
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60"
              >
                {createMutation.isPending ? "Creating..." : "Create account"}
              </button>

              {createMutation.isError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {(createMutation.error as any)?.message ?? "Create failed"}
                </div>
              ) : null}
            </div>
          </form>
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((acc: any) => (
            <div
              key={acc.id}
              className={
                "group rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md " +
                (acc.isDefault
                  ? "border-2 border-emerald-200 ring-2 ring-emerald-50"
                  : "border border-slate-200")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-xl font-semibold text-slate-900">{acc.name}</h3>

                    {acc.isDefault ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        <span className="text-sm leading-none">★</span>
                        Default
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                      {enumToString(acc.type)}
                    </span>
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">
                      {acc.currency}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-slate-600">
                    <div>
                      <span className="font-medium text-slate-700">Type:</span> {enumToString(acc.type)}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Currency:</span> {acc.currency}
                    </div>
                    {acc.isDefault ? (
                      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        This account is used by Quick Add by default.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(acc)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(acc)}
                    disabled={deleteMutation.isPending}
                    className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:opacity-60"
                  >
                    Delete
                  </button>

                  {acc.isDefault ? (
                    <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      Default account
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDefault(acc)}
                      disabled={defaultMutation.isPending}
                      className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:opacity-60"
                    >
                      Set as default
                    </button>
                  )}

                </div>
              </div>

              <button
                type="button"
                onClick={() => goToTransactions(acc)}
                className="mt-5 w-full rounded-xl bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 ring-1 ring-inset ring-sky-200 transition hover:bg-sky-100"
              >
                View transactions →
              </button>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
              onClick={closeEdit}
            />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Edit account</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Update the account details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl px-3 py-2 text-slate-600 transition hover:bg-slate-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700">
                    Account Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium text-slate-700">
                    Account Type
                  </label>
                  <select
                    id="edit-type"
                    value={editType}
                    onChange={(e) => setEditType(stringToAccountType(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">All</option>
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {enumToString(t)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-currency" className="block text-sm font-medium text-slate-700">
                    Currency
                  </label>
                  <select
                    id="edit-currency"
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">Select currency</option>
                    {CURRENCIES.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>

                {updateMutation.isError ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {(updateMutation.error as any)?.message ?? "Update failed"}
                  </div>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}