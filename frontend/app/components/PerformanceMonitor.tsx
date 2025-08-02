'use client'

import { useEffect, useState, useMemo } from 'react'
import { performanceMonitor, PerformanceMetrics } from '../lib/performance'

interface PerformanceMonitorProps {
  show?: boolean
}

export default function PerformanceMonitor({ show = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    messageCount: 0,
    averageMessageLength: 0,
    scrollPerformance: 0
  })

  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    const updateMetrics = () => {
      const avgMetrics = performanceMonitor.getAverageMetrics()
      setMetrics(avgMetrics)
    }

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000)
    updateMetrics() // Initial update

    return () => clearInterval(interval)
  }, [])

  // Memoize performance status
  const performanceStatus = useMemo(() => {
    if (metrics.renderTime < 16) return { status: 'Excellent', color: 'text-green-600' }
    if (metrics.renderTime < 33) return { status: 'Good', color: 'text-yellow-600' }
    return { status: 'Needs Optimization', color: 'text-red-600' }
  }, [metrics.renderTime])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4 shadow-lg z-50 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close performance monitor"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={performanceStatus.color}>{performanceStatus.status}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Avg Render:</span>
          <span className="text-gray-800">{metrics.renderTime.toFixed(1)}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Messages:</span>
          <span className="text-gray-800">{Math.round(metrics.messageCount)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Avg Length:</span>
          <span className="text-gray-800">{Math.round(metrics.averageMessageLength)} chars</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <button
          onClick={() => performanceMonitor.clearMetrics()}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Clear Metrics
        </button>
      </div>
    </div>
  )
} 