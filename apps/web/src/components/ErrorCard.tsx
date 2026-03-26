// components/ErrorCard.tsx
import { useState } from "react"

type ErrorCardProps = {
  message: string | null
  title: string
  closable?: boolean
}

export default function ErrorCard({
  message,
  title,
  closable = true,
}: ErrorCardProps) {
  const [visible, setVisible] = useState(true)

  if (!message || !visible) return null

  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-red-200 bg-red-50/60 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-red-700">
            {title}
          </h3>
          <p className="mt-1 text-sm text-red-600">
            {message}
          </p>
        </div>

        {closable && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-md p-1 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}