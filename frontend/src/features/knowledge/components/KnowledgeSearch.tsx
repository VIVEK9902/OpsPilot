import { useState } from "react"
import { apiClient } from "@/lib/api/client"
import type { KnowledgeSearchResponse } from "@/types/api"
import { BookOpen, AlertCircle, Plus, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function KnowledgeSearch() {
  const { user } = useAuth()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<KnowledgeSearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [showIngestForm, setShowIngestForm] = useState(false)
  const [ingestForm, setIngestForm] = useState({ name: '', version: '1.0', accessLevel: 'PUBLIC', content: '' })
  const [ingestStatus, setIngestStatus] = useState<{loading: boolean, error?: string, success?: boolean}>({ loading: false })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await apiClient.post('/knowledge/search', { query, maxResults: 5 })
      setResults(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIngestStatus({ loading: true })
    try {
      await apiClient.post('/knowledge/documents', ingestForm)
      setIngestStatus({ loading: false, success: true })
      setTimeout(() => {
        setShowIngestForm(false)
        setIngestStatus({ loading: false })
        setIngestForm({ name: '', version: '1.0', accessLevel: 'PUBLIC', content: '' })
      }, 2000)
    } catch (err: any) {
      setIngestStatus({ loading: false, error: err.response?.data?.message || 'Ingestion failed' })
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Knowledge Base</h1>
          <p className="text-on-surface-variant text-sm">Search policies, manuals, and FAQs.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowIngestForm(!showIngestForm)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-surface-container-highest text-on-surface rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {showIngestForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showIngestForm ? "Close Form" : "Add Document"}
          </button>
        )}
      </div>

      {showIngestForm && user?.role === 'ADMIN' && (
        <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-lg font-bold text-on-surface mb-4">Ingest New Document</h3>
          <form onSubmit={handleIngest} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Document Name</label>
                <input 
                  required
                  value={ingestForm.name}
                  onChange={e => setIngestForm({...ingestForm, name: e.target.value})}
                  className="bg-surface-container px-3 py-2 rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Version</label>
                <input 
                  required
                  value={ingestForm.version}
                  onChange={e => setIngestForm({...ingestForm, version: e.target.value})}
                  className="bg-surface-container px-3 py-2 rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Access Level</label>
                <select 
                  value={ingestForm.accessLevel}
                  onChange={e => setIngestForm({...ingestForm, accessLevel: e.target.value})}
                  className="bg-surface-container px-3 py-2 rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="CONFIDENTIAL">Confidential</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Content</label>
              <textarea 
                required
                rows={5}
                value={ingestForm.content}
                onChange={e => setIngestForm({...ingestForm, content: e.target.value})}
                className="bg-surface-container px-3 py-2 rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:outline-none transition-colors resize-y"
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-medium">
                {ingestStatus.error && <span className="text-error">{ingestStatus.error}</span>}
                {ingestStatus.success && <span className="text-primary">Document ingested and vectorized successfully!</span>}
              </div>
              <button 
                type="submit" 
                disabled={ingestStatus.loading}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-colors shadow-sm"
              >
                {ingestStatus.loading ? "Ingesting..." : "Ingest Document"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface-container-low p-3 rounded-xl shadow-sm">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">search</span>
          <input 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            className="w-full bg-surface-container pl-12 pr-32 py-4 rounded-xl text-base text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors shadow-inner" 
            placeholder="What do you need help with?" 
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 flex items-center gap-2 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:hover:bg-primary"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
      
      {results && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <h3 className="text-xl font-bold text-on-surface border-b border-surface-container-highest pb-2">Search Results</h3>
          {results.documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-container-lowest border border-surface-container rounded-2xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-outline" />
              </div>
              <h4 className="text-lg font-semibold text-on-surface mb-1">No articles found</h4>
              <p className="text-sm text-on-surface-variant">We couldn't find any articles matching "{query}". Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.documents.map((doc, idx) => (
                <div key={idx} className="group bg-surface-container-lowest border border-surface-container p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-surface-container-highest transition-all">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-container/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{doc.title}</h4>
                      <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-wrap">{doc.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
