import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/homes/$orgId/notes/')({
  component: NotesIndex,
})

function NotesIndex() {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes/' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, isFolder: boolean }) => 
      api.post(`/organizations/${orgId}/notes`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      navigate({ to: `/homes/${orgId}/notes/${res.data.data.id}` })
    }
  })

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-reveal">
      <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 shadow-sm border border-primary/10">
        <FileText className="h-10 w-10 text-primary/40" />
      </div>
      <h2 className="text-2xl font-black tracking-tight mb-2">{t('notes.welcome_title')}</h2>
      <p className="text-muted-foreground max-w-sm mb-8 font-medium leading-relaxed">
        {t('notes.welcome_desc')}
      </p>
      <Button 
        size="lg" 
        className="rounded-xl px-8 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false })}
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('notes.new_page')}
      </Button>
    </div>
  )
}
