import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState, useCallback, useEffect } from 'react'
import { TiptapEditor } from '@/components/notes/editor'
import { useTranslation } from 'react-i18next'
import api from '@/lib/axios'
import { NoteBreadcrumbs } from '@/components/notes/breadcrumbs'
import { 
  Loader2, 
  FileText
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'

export const Route = createFileRoute('/homes/$orgId/notes/$noteId')({
  component: NotePage,
})

function NotePage() {
  const { t } = useTranslation()
  const { orgId, noteId } = useParams({ from: '/homes/$orgId/notes/$noteId' })
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')

  const { data: noteRes, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => api.get(`/organizations/${orgId}/notes/${noteId}`),
  })

  const { data: allNotesRes } = useQuery({
    queryKey: ['notes', orgId],
    queryFn: () => api.get(`/organizations/${orgId}/notes`),
  })

  useEffect(() => {
    if (noteRes?.data) {
      setTitle(noteRes.data.title || '')
    }
  }, [noteRes])

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string, content?: string }) => 
      api.patch(`/organizations/${orgId}/notes/${noteId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      setIsSaving(false)
    }
  })

  // Optimized "Lazy Save" - Increase delay to 3.5s to reduce requests
  const debouncedSave = useCallback(
    debounce((data: { title?: string, content?: string }) => {
      setIsSaving(true)
      updateMutation.mutate(data)
    }, 3500),
    [orgId, noteId, updateMutation]
  )

  // Effect to handle "Save on Leave" (Cleanup)
  useEffect(() => {
    return () => {
      // Flush any pending debounced calls when navigating away
      debouncedSave.flush()
    }
  }, [debouncedSave])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    debouncedSave({ title: newTitle })
  }

  const handleContentChange = (newContent: string) => {
    debouncedSave({ content: newContent })
  }

  const handleBlur = () => {
    // If we've made changes, save immediately when clicking away
    debouncedSave.flush()
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    )
  }

  const note = noteRes?.data
  const allNotes = allNotesRes?.data || []

  if (!note) return null

  return (
    <div className="h-full flex flex-col pt-12 pb-8 overflow-hidden bg-background">
        <div className="h-16 border-b flex items-center justify-between px-8 bg-background/90 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 truncate">
             <NoteBreadcrumbs currentId={noteId} notes={allNotes} orgId={orgId} />
             <div className="h-4 w-px bg-border mx-2 shrink-0 md:block hidden" />
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 shrink-0 md:flex hidden">
                {isSaving ? t('notes.saving') : t('notes.saved')}
             </div>
          </div>
        </div>

       <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar bg-background">
          <div className="max-w-2xl w-full mx-auto flex flex-col h-full animate-reveal space-y-10">
            {/* Header Content Section */}
            <div className="relative group/title space-y-10">
               {/* Icon Placeholder (For future Icon Picker) */}
               <div className="h-24 w-24 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/20 group-hover/title:bg-primary/10 transition-all border-2 border-dashed border-primary/10 cursor-pointer">
                  <FileText className="h-10 w-10" />
               </div>

               <input 
                 autoFocus={!title || title === 'Untitled'}
                 className="text-5xl md:text-6xl font-black tracking-tighter bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/10 focus:placeholder:opacity-0 transition-all"
                 placeholder={t('notes.untitled')}
                 value={title}
                 onChange={(e) => handleTitleChange(e.target.value)}
                 onBlur={handleBlur}
                 onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
               />
            </div>

            <div className="min-h-[500px]">
              <TiptapEditor 
                content={note.content} 
                onChange={handleContentChange} 
                onBlur={handleBlur}
              />
            </div>
          </div>
       </div>
    </div>
  )
}
