// Tiny pub/sub so the LLM console can drive any view without prop drilling.
const listeners = new Map()

export const bus = {
  on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, new Set())
    listeners.get(event).add(fn)
    return () => listeners.get(event)?.delete(fn)
  },
  emit(event, payload) {
    listeners.get(event)?.forEach((fn) => fn(payload))
  },
}
