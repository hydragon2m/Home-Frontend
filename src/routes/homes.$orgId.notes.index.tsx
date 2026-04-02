import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Folder, FileText, Plus, Clock, ChevronRight, Hash } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'

export const Route = createFileRoute('/homes/$orgId/notes/')({
  component: NotesIndex,
})

function NotesIndex() {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes/' }) as any
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: notesRes, isLoading } = useQuery({
    queryKey: ['notes', orgId],
    queryFn: () => api.get(`/organizations/${orgId}/notes`),
  })

  // IMPORTANT: The axios interceptor already returns 'response.data' which is { success, message, data }
  // So 'notesRes' is that object. We access 'notesRes.data' for the notes array.
  const allNotes = notesRes?.data || []
  
  // For the root index, we only want to show notes that have NO parent
  const rootNotes = allNotes.filter((n: any) => !n.parentId)
  const folders = rootNotes.filter((n: any) => n.isFolder)
  const pages = rootNotes.filter((n: any) => !n.isFolder)

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, isFolder: boolean, parentId?: string | null }) => 
      api.post(`/organizations/${orgId}/notes`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      if (res.data && !res.data.data.isFolder) {
        navigate({ to: `/homes/${orgId}/notes/${res.data.data.id}` as any })
      }
    }
  })

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-background/50">
      <div className="max-w-6xl mx-auto p-8 md:p-12 space-y-12 animate-reveal">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-dashed">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary/60">
                 <Hash className="h-4 w-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('notes.title')}</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-5xl font-black tracking-tighter">{t('notes.welcome_title')}</h2>
                <p className="text-muted-foreground font-medium text-lg max-w-md leading-relaxed">{t('notes.welcome_desc')}</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="lg" 
                className="rounded-2xl px-6 font-black h-14 border-2 hover:bg-muted/50 transition-all border-primary/10"
                onClick={() => createNoteMutation.mutate({ title: t('notes.untitled_folder'), isFolder: true, parentId: null })}
              >
                <Folder className="mr-2 h-4 w-4 text-primary/40" />
                {t('notes.new_folder')}
              </Button>
              <Button 
                size="lg" 
                className="rounded-2xl px-8 font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all h-14 bg-primary hover:bg-primary/90"
                onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId: null })}
              >
                <Plus className="mr-2 h-5 w-5" />
                {t('notes.new_page')}
              </Button>
           </div>
        </div>

        {/* Folders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/40">{t('notes.new_folder')}</h3>
            <span className="text-[10px] font-bold text-primary/30">{folders.length} {t('notes.items')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder: any) => (
              <Card 
                key={folder.id} 
                className="group cursor-pointer hover:ring-2 ring-primary/20 hover:shadow-xl transition-all duration-500 border-2 bg-background/60 backdrop-blur-xl rounded-2xl overflow-hidden"
                onClick={() => navigate({ to: `/homes/${orgId}/notes/folder/${folder.id}` as any })}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                    <Folder className="h-5 w-5 fill-current opacity-40 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1 truncate">
                     <p className="font-black text-xs truncate uppercase tracking-tight">{folder.title || t('notes.untitled_folder')}</p>
                     <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-wider">{t('notes.empty_folder')}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            ))}

            <button 
              className="h-[88px] rounded-2xl border-2 border-dashed border-muted-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center px-6 gap-4 group"
              onClick={() => createNoteMutation.mutate({ title: t('notes.untitled_folder'), isFolder: true, parentId: null })}
            >
                <div className="h-10 w-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all group-hover:scale-110">
                   <Plus className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary transition-colors">{t('notes.new_folder')}</span>
            </button>
          </div>
        </div>

        {/* Pages Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-1">
             <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-muted-foreground/40">{t('notes.new_page')}</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {pages.map((page: any) => (
                <Card 
                  key={page.id} 
                  className="group cursor-pointer hover:ring-2 ring-primary/20 hover:shadow-2xl transition-all duration-500 border-2 bg-background rounded-3xl overflow-hidden flex flex-col h-full min-h-[220px]"
                  onClick={() => navigate({ to: `/homes/${orgId}/notes/${page.id}` as any })}
                >
                  <CardContent className="p-7 flex flex-col h-full justify-between gap-6">
                    <div className="space-y-5">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:-rotate-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-black text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{page.title || t('notes.untitled')}</p>
                        <p className="text-xs text-muted-foreground/60 line-clamp-3 font-medium leading-relaxed">
                          {page.content ? page.content.replace(/<[^>]*>/g, '').slice(0, 100) : t('notes.write_placeholder')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-dashed">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                         <Clock className="h-3 w-3" />
                         {new Date(page.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="h-5 w-5 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
             ))}

             <button 
               className="h-full min-h-[220px] rounded-3xl border-2 border-dashed border-muted-foreground/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 group"
               onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId: null })}
             >
                <div className="h-14 w-14 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all group-hover:scale-110 group-hover:rotate-90">
                   <Plus className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-primary transition-colors">{t('notes.new_page')}</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  )
}
