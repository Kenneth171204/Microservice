import { useEffect, useState } from 'react'

function withTimeout(promise, ms) {
  const ctrl = new AbortController()
  const t = new Promise((_, reject) => {
    const id = setTimeout(() => {
      ctrl.abort()
      reject(new Error('timeout'))
    }, ms)
    // prevent unhandled timer
    promise.finally(() => clearTimeout(id))
  })

  return Promise.race([promise, t, ctrl.signal])
}

export default function useServiceAvailability({ url, timeoutMs = 2500 }) {
  const [status, setStatus] = useState('unknown') // unknown | up | down
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function check() {
      try {
        setStatus('unknown')
        setError(null)

        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeoutMs)

        const res = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        })

        clearTimeout(timer)

        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        if (!mounted) return
        setStatus('up')
      } catch (e) {
        if (!mounted) return
        setError(e?.message || 'unavailable')
        setStatus('down')
      }
    }

    check()

    const id = setInterval(check, 5000)

    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [url, timeoutMs])

  return { status, error }
}

