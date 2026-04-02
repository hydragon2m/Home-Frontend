import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Folder, FileText, Plus, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { NoteBreadcrumbs } from '@/components/notes/breadcrumbs'

export const Route = createFileRoute('/homes/$orgId/notes/folder/$folderId')({
  component: FolderView,
})

function FolderView() {
  const { t } = useTranslation()
  const { orgId, folderId } = useParams({ from: '/homes/$orgId/notes/folder/$folderId' }) as any
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Use the same query as the sidebar
  const { data: notesRes, isLoading } = useQuery({
    queryKey: ['notes', orgId],
    queryFn: () => api.get(`/organizations/${orgId}/notes`),
  })

  const allNotes = notesRes?.data?.data || []
  const folder = allNotes.find((n: any) => n.id === folderId)
  const children = allNotes.filter((n: any) => n.parentId === folderId)
  
  const subFolders = children.filter((n: any) => n.isFolder)
  const pages = children.filter((n: any) => !n.isFolder)

  const createNoteMutation = useMutation({
    mutationFn: (data: { title: string, isFolder: boolean, parentId?: string }) => 
      api.post(`/organizations/${orgId}/notes`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['notes', orgId] })
      if (!res.data.data.isFolder) {
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

  if (!folder) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest opacity-20">{t('notes.not_found')}</h2>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-background/50">
      <div className="max-w-6xl mx-auto p-8 md:p-12 space-y-8 animate-reveal">
        {/* Breadcrumbs Section */}
        <div className="pb-4 border-b border-dashed border-primary/10">
          <NoteBreadcrumbs currentId={folderId} notes={allNotes} orgId={orgId} />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                 <Folder className="h-5 w-5 fill-current opacity-40" />
                 <span className="text-xs font-black uppercase tracking-widest">{t('notes.new_folder')}</span>
              </div>
              <h2 className="text-4xl font-black tracking-tight">{folder.title || t('notes.untitled_folder')}</h2>
              <p className="text-muted-foreground font-medium max-w-md">
                {children.length} {t('notes.items') || 'mục'} trong thư mục này
              </p>
           </div>
           <Button 
             size="lg" 
             className="rounded-xl px-8 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all h-12"
             onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId: folderId })}
           >
             <Plus className="mr-2 h-4 w-4" />
             {t('notes.new_page')}
           </Button>
        </div>

        {/* Dashboard Content */}
        {children.length > 0 ? (
          <div className="space-y-10">
            {/* Sub-Folders Section */}
            {subFolders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 px-1">{t('notes.new_folder')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subFolders.map((sub: any) => (
                    <Card 
                      key={sub.id} 
                      className="group cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-300 border-2 bg-background/40 backdrop-blur-sm"
                      onClick={() => navigate({ to: `/homes/${orgId}/notes/folder/${sub.id}` as any })}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Folder className="h-5 w-5 fill-current opacity-40" />
                        </div>
                        <div className="flex-1 truncate">
                           <p className="font-bold text-sm truncate">{sub.title || t('notes.untitled_folder')}</p>
                           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t('notes.new_folder')}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Pages Section */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 px-1">{t('notes.new_page')}</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {pages.map((page: any) => (
                    <Card 
                      key={page.id} 
                      className="group cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-300 border-2 bg-background"
                      onClick={() => navigate({ to: `/homes/${orgId}/notes/${page.id}` as any })}
                    >
                      <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                        <div className="space-y-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-base leading-tight group-hover:text-primary transition-colors">{page.title || t('notes.untitled')}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 font-medium opacity-60">
                              {page.content ? page.content.replace(/<[^>]*>/g, '').slice(0, 80) : t('notes.write_placeholder')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 pt-4 border-t border-dashed">
                           <Clock className="h-3 w-3" />
                           {new Date(page.updatedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                 ))}

                 {/* Creation Card */}
                 <button 
                   className="h-full min-h-[160px] rounded-xl border-2 border-dashed border-muted-foreground/10 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
                   onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId: folderId })}
                 >
                    <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
                       <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 group-hover:text-primary transition-colors">{t('notes.new_page')}</span>
                 </button>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Folder className="h-12 w-12 text-primary opacity-20" />
             </div>
             <h3 className="text-xl font-bold mb-2">{t('notes.empty_folder')}</h3>
             <p className="text-muted-foreground mb-8 max-w-sm">{t('notes.welcome_desc')}</p>
             <Button 
               size="lg" 
               className="rounded-xl px-10 font-black shadow-lg"
               onClick={() => createNoteMutation.mutate({ title: t('notes.untitled'), isFolder: false, parentId: folderId })}
             >
               {t('notes.new_page')}
             </Button>
          </div>
        )}
      </div>
    </div>
  )
}
