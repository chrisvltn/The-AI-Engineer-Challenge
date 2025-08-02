// Performance monitoring utilities

export interface PerformanceMetrics {
  renderTime: number
  messageCount: number
  averageMessageLength: number
  scrollPerformance: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private renderStartTime: number = 0

  startRenderTimer() {
    this.renderStartTime = performance.now()
  }

  endRenderTimer() {
    const renderTime = performance.now() - this.renderStartTime
    return renderTime
  }

  recordMetrics(metrics: Partial<PerformanceMetrics>) {
    this.metrics.push({
      renderTime: 0,
      messageCount: 0,
      averageMessageLength: 0,
      scrollPerformance: 0,
      ...metrics
    })
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return {
        renderTime: 0,
        messageCount: 0,
        averageMessageLength: 0,
        scrollPerformance: 0
      }
    }

    const sum = this.metrics.reduce((acc, metric) => ({
      renderTime: acc.renderTime + metric.renderTime,
      messageCount: acc.messageCount + metric.messageCount,
      averageMessageLength: acc.averageMessageLength + metric.averageMessageLength,
      scrollPerformance: acc.scrollPerformance + metric.scrollPerformance
    }), {
      renderTime: 0,
      messageCount: 0,
      averageMessageLength: 0,
      scrollPerformance: 0
    })

    const count = this.metrics.length
    return {
      renderTime: sum.renderTime / count,
      messageCount: sum.messageCount / count,
      averageMessageLength: sum.averageMessageLength / count,
      scrollPerformance: sum.scrollPerformance / count
    }
  }

  clearMetrics() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Request deduplication utility
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = requestFn()
    this.pendingRequests.set(key, promise)

    try {
      const result = await promise
      return result
    } finally {
      this.pendingRequests.delete(key)
    }
  }

  clear() {
    this.pendingRequests.clear()
  }
}

export const requestDeduplicator = new RequestDeduplicator()

// Throttle utility for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return ((...args: any[]) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }) as T
}
