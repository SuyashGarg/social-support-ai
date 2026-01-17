export type HistoryEntry = {
    id: string
    submittedAt: string
    data: Record<string, string | boolean>
}

const HISTORY_KEY = 'history'

const readHistory = (): HistoryEntry[] => {
    if (typeof window === 'undefined') return []
    try {
        const raw = window.sessionStorage.getItem(HISTORY_KEY)
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
    } catch {
        return []
    }
}

const writeHistory = (entries: HistoryEntry[]) => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

export const addHistoryEntry = (entry: HistoryEntry) => {
    const entries = readHistory()
    const next = [entry, ...entries]
    writeHistory(next)
    return next
}

export const getHistoryEntries = () => readHistory()

export const getHistoryEntryById = (id: string) => {
    const entries = readHistory()
    return entries.find((entry) => entry.id === id) ?? null
}

export const clearHistory = () => {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(HISTORY_KEY)
}
