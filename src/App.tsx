import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface HealthStatus {
  status: string
  service: string
  version: string
}

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get<HealthStatus>(`${API}/health`)
      .then(r => setHealth(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-pulse text-gray-400 text-sm">Connecting...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Platform Portal</h1>
        <p className="text-gray-400 text-sm">Frontend Web Application</p>
      </div>

      <div className={`rounded-xl border p-6 w-full max-w-sm ${
        health?.status === 'ok'
          ? 'border-green-500/30 bg-green-500/10'
          : 'border-red-500/30 bg-red-500/10'
      }`}>
        {error ? (
          <div className="text-red-400 text-sm">
            <div className="font-semibold mb-1">API Unreachable</div>
            <div className="text-xs opacity-75">{error}</div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-green-400 font-semibold">● {health?.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span>{health?.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span>{health?.version}</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600">API: {API}</p>
    </div>
  )
}
