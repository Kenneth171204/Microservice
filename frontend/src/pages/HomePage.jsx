import React from 'react'
import { Link } from 'react-router-dom'

const CARD = 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition'

function ServiceCard({ to, title, desc }) {
  return (
    <Link to={to} className={CARD}>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        Open page <span aria-hidden>→</span>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-7 text-white shadow-sm">
        <h1 className="text-2xl font-bold">Microservices Frontend</h1>
        <p className="mt-2 text-sm text-white/90">
          This UI calls only through the API Gateway (port 8080). If a microservice is down, the related page shows a friendly busy screen and motivational quote.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/services"
            className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            View service details
          </Link>
          <Link
            to="/order"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Try Order page
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ServiceCard to="/user" title="User Service" desc="Login/register related endpoints via API gateway." />
        <ServiceCard to="/restaurant" title="Restaurant Service" desc="Restaurants and menus availability checks." />
        <ServiceCard to="/order" title="Order Service" desc="Create and manage orders endpoints via API gateway." />
        <ServiceCard to="/delivery" title="Delivery Service" desc="Delivery routes and health status (via /health)." />
      </div>
    </div>
  )
}

