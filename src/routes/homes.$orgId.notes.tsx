import { createFileRoute, Outlet, useParams, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { NoteSidebar } from '@/components/notes/sidebar'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Search, Plus, Settings } from 'lucide-react'
import api from '@/lib/axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/homes/$orgId/notes')({
  component: NotesLayout,
})

function NotesLayout() {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: notesRes, isLoading } = useQuery({
    queryKey: ['notes', orgId],
    queryFn: () => api.get(`/organizations/${orgId}/notes`),
  })

  const notes = notesRes?.data?.data || []

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    return notes.filter((note: any) => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [notes, searchQuery])

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, isFolder: boolean, parentId?: string }) => 
      api.post(`/organizations/${orgId}/notes`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      if (!res.data.data.isFolder) {
        navigate({ to: `/homes/${orgId}/notes/${res.data.data.id}` })
      }
    }
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/organizations/${orgId}/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      // If we are currently viewing this note, navigate back to index
      if (window.location.pathname.includes(orgId + '/notes/')) {
        const parts = window.location.pathname.split('/')
        if (parts[parts.length - 1] !== 'notes') {
           navigate({ to: `/homes/${orgId}/notes` })
        }
      }
    }
  })

  const renameNoteMutation = useMutation({
    mutationFn: ({ id, title }: { id: string, title: string }) => 
      api.patch(`/organizations/${orgId}/notes/${id}`, { title }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      queryClient.invalidateQueries({ queryKey: ['note', variables.id] })
    }
  })

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`${isSidebarOpen ? 'w-72' : 'w-0'} border-r bg-muted/10 flex flex-col transition-all duration-300 ease-in-out relative group`}
      >
        <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
               N
            </div>
            <span className="font-bold text-sm tracking-tight whitespace-nowrap">{t('notes.title')}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
          <div className="mb-4 px-2">
             <div className="relative group/search">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
               <input 
                 placeholder={t('notes.search_placeholder')} 
                 className="w-full bg-muted/30 border-none h-8 pl-8 rounded-lg text-xs outline-none focus:ring-1 ring-primary/20 transition-all font-medium"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
          
          <NoteSidebar 
            notes={filteredNotes} 
            isLoading={isLoading} 
            onAddPage={(parentId) => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId })}
            onAddFolder={(parentId) => createNoteMutation.mutate({ title: t('notes.untitled_folder'), isFolder: true, parentId })}
            onRename={(id, title) => renameNoteMutation.mutate({ id, title })}
            onDelete={(id) => deleteNoteMutation.mutate(id)}
          />
        </div>

        <div className="h-12 border-t flex items-center px-4 gap-2 shrink-0 overflow-hidden bg-muted/5">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5">
             <Settings className="h-4 w-4 text-muted-foreground" />
           </Button>
           <div className="h-4 w-px bg-border mx-1" />
           <Button 
             variant="ghost" 
             className="flex-1 h-8 justify-start gap-2 text-xs font-bold px-2 rounded-lg hover:bg-primary/5"
             onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false })}
           >
             <Plus className="h-3.5 w-3.5 text-primary" />
             {t('notes.new_page')}
           </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {!isSidebarOpen && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-3 left-3 z-50 h-8 w-8 rounded-full shadow-md bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/5 animate-reveal"
            onClick={() => setIsSidebarOpen(true)}
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </Button>
        )}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
