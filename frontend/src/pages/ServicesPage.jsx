import React from 'react'

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8080'

function Row({ title, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-sm font-semibold text-gray-900 break-words">{value}</div>
    </div>
  )
}

const services = [
  {
    key: 'user',
    name: 'User Service',
    port: 8001,
    gatewayPrefix: '/api/user/',
    availabilityCheck: `${API_GATEWAY}/api/user/`
  },
  {
    key: 'restaurant',
    name: 'Restaurant Service',
    port: 8002,
    gatewayPrefix: '/api/restaurant/',
    availabilityCheck: `${API_GATEWAY}/api/restaurant/`
  },
  {
    key: 'order',
    name: 'Order Service',
    port: 8003,
    gatewayPrefix: '/api/order/',
    availabilityCheck: `${API_GATEWAY}/api/order/`
  },
  {
    key: 'delivery',
    name: 'Delivery Service',
    port: 8004,
    gatewayPrefix: '/api/delivery/',
    availabilityCheck: `${API_GATEWAY}/api/delivery/health`
  }
]

export default function ServicesPage() {
  return (
    <div>
      <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Microservice Details</h1>
        <p className="mt-2 text-sm text-gray-600">
          Frontend communicates only through <span className="font-semibold">API Gateway</span> (port 8080). If a service is unavailable,
          the related page shows: “Sorry, this page is busy, try again later.” plus a motivational quote.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.key} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">{s.name}</h2>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <Row title="Service Port" value={`${s.port}`} />
              <Row title="API Gateway Prefix" value={s.gatewayPrefix} />
              <Row title="Availability Check Used by Frontend" value={s.availabilityCheck} />
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Tip: stop the corresponding container to see the busy screen.
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

