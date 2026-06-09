import React from 'react'
import ServiceBusy from '../components/ServiceBusy.jsx'
import useServiceAvailability from '../components/useServiceAvailability.js'

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8080'

export default function UserPage() {
  const { status } = useServiceAvailability({
    url: `${API_GATEWAY}/api/user/`,
    timeoutMs: 2500
  })

  if (status === 'down') return <ServiceBusy serviceName="User Service" />

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">User Service</h1>
      <p className="mt-2 text-sm text-gray-600">
        User service appears to be running. This demo focuses on service-down UX.
      </p>

      <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold">Available (example) endpoints via API gateway:</p>
        <ul className="mt-2 list-disc pl-5">
          <li><code className="rounded bg-white px-1">POST /api/user/register</code></li>
          <li><code className="rounded bg-white px-1">POST /api/user/login</code></li>
          <li><code className="rounded bg-white px-1">GET /api/user/profile</code></li>
          <li><code className="rounded bg-white px-1">POST /api/user/logout</code></li>
        </ul>
      </div>
    </section>
  )
}

