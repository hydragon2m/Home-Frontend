import { createFileRoute, useParams } from '@tanstack/react-router'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/homes/$orgId/notes/')({
  component: NotesIndex,
})

function NotesIndex() {
  const { orgId } = useParams({ from: '/homes/$orgId/notes/' })
  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, isFolder: boolean }) => 
      api.post(`/organizations/${orgId}/notes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
    }
  })

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-reveal">
      <div className="h-20 w-20 rounded-[2rem] bg-primary/5 flex items-center justify-center mb-6 shadow-inner">
        <FileText className="h-10 w-10 text-primary opacity-40" />
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-2">Welcome to your Notes</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 font-medium leading-relaxed">
        Select a note from the sidebar or create a new one to start writing. Organize your thoughts with folders and sub-pages.
      </p>
      <div className="flex gap-3">
        <Button 
          className="h-10 px-6 font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary hover:scale-105 active:scale-95 transition-all"
          onClick={() => createNoteMutation.mutate({ title: 'Untitled', isFolder: false })}
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Page
        </Button>
      </div>
    </div>
  )
}
