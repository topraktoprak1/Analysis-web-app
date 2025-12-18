import React from 'react'

// Minimal Card component used by Dashboard. Keep styles simple and Tailwind-compatible.
export default function CardDataStats({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            {icon ? icon : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor"/></svg>}
          </div>
          <div>
            <div className="text-xs text-gray-500">{subtitle || title}</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
