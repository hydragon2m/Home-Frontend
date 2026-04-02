import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { TiptapEditor } from '@/components/notes/editor'
import api from '@/lib/axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { Loader2, CloudCheck } from 'lucide-react'

export const Route = createFileRoute('/homes/$orgId/notes/$noteId')({
  component: NoteEditorPage,
})

function NoteEditorPage() {
  const { orgId, noteId } = useParams({ from: '/homes/$orgId/notes/$noteId' })
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)

  const { data: noteRes, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => api.get(`/organizations/${orgId}/notes/${noteId}`),
  })

  const updateMutation = useMutation({
    mutationFn: (data: { title?: string, content?: string }) => 
      api.patch(`/organizations/${orgId}/notes/${noteId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      setIsSaving(false)
    }
  })

  // Debounced save
  const debouncedSave = useCallback(
    debounce((data: { title?: string, content?: string }) => {
      setIsSaving(true)
      updateMutation.mutate(data)
    }, 1000),
    [orgId, noteId]
  )

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
      </div>
    )
  }

  const note = noteRes?.data?.data
  if (!note) return null

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 animate-reveal">
      <div className="max-w-4xl mx-auto w-full mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-muted-foreground/40 font-bold uppercase tracking-widest text-[10px]">
             {isSaving ? (
               <>
                 <Loader2 className="h-3 w-3 animate-spin" />
                 <span>Saving...</span>
               </>
             ) : (
               <>
                 <CloudCheck className="h-3 w-3" />
                 <span>Saved</span>
               </>
             )}
           </div>
        </div>
        <input 
          value={note.title}
          onChange={(e) => {
            queryClient.setQueryData(['note', noteId], (old: any) => ({
              ...old,
              data: { ...old.data, title: e.target.value }
            }));
            debouncedSave({ title: e.target.value });
          }}
          className="text-4xl sm:text-5xl font-black tracking-tight bg-transparent border-none outline-none placeholder:opacity-20 w-full"
          placeholder="Untitled"
        />
      </div>

      <TiptapEditor 
        content={note.content || ''} 
        onChange={(content) => debouncedSave({ content })}
      />
    </div>
  )
}
