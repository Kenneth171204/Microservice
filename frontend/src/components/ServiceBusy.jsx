import React, { useMemo } from 'react'

const QUOTES = [
  { author: 'Nelson Mandela', text: 'It always seems impossible until it is done.' },
  { author: 'Winston Churchill', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.' },
  { author: 'Thomas Edison', text: 'I have not failed. I’ve just found 10,000 ways that won’t work.' },
  { author: 'Mother Teresa', text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.' },
  { author: 'Yoda', text: 'Do, or do not. There is no try.' },
  { author: 'Confucius', text: 'Our greatest glory is not in never failing, but in rising every time we fail.' }
]

export default function ServiceBusy({ serviceName }) {
  const quote = useMemo(() => {
    const idx = Math.floor(Math.random() * QUOTES.length)
    return QUOTES[idx]
  }, [])

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <span className="text-lg">⏳</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sorry, this page is busy, try again later.</h1>
          <p className="mt-2 text-sm text-gray-600">
            The <span className="font-semibold text-gray-800">{serviceName}</span> service is currently unavailable.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-700">“{quote.text}”</p>
        <p className="mt-2 text-xs font-semibold text-gray-500">— {quote.author}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-gray-100 px-3 py-1">Tip: check the backend containers</span>
        <span className="rounded-full bg-gray-100 px-3 py-1">Tip: refresh after a few seconds</span>
      </div>
    </section>
  )
}

