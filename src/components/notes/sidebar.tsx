import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ChevronRight, ChevronDown, FileText, Folder, MoreVertical, Plus, Trash, Edit2, FolderPlus, FilePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface Note {
  id: string
  title: string
  isFolder: boolean
  parentId: string | null
}

interface NoteSidebarProps {
  notes: Note[]
  isLoading: boolean
  onAddPage: (parentId?: string) => void
  onAddFolder: (parentId?: string) => void
}

export function NoteSidebar({ notes, isLoading, onAddPage, onAddFolder }: NoteSidebarProps) {
  const { t } = useTranslation()
  
  const buildTree = (parentId: string | null = null) => {
    return notes
      .filter(n => n.parentId === parentId)
      .sort((a, b) => (a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-full animate-pulse bg-muted/40 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!isLoading && notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-reveal">
        <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground/30" />
        </div>
        <p className="text-xs font-bold text-muted-foreground/60 mb-4">{t('notes.no_notes')}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider border-primary/20 hover:bg-primary/5 shadow-sm"
          onClick={() => onAddPage()}
        >
          {t('notes.create_first')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      {buildTree(null).map(note => (
        <NoteItem 
           key={note.id} 
           note={note} 
           allNotes={notes} 
           onAddPage={onAddPage} 
           onAddFolder={onAddFolder} 
        />
      ))}
    </div>
  )
}

function NoteItem({ 
  note, 
  level = 0, 
  onAddPage, 
  onAddFolder,
  allNotes
}: { 
  note: any, 
  level?: number, 
  onAddPage: (parentId: string) => void,
  onAddFolder: (parentId: string) => void,
  allNotes: any[]
}) {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes' }) as any
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const children = allNotes.filter(n => n.parentId === note.id)
  const isSelected = window.location.pathname.includes(note.id)

  const handleSelect = () => {
    if (!note.isFolder) {
      navigate({ to: `/homes/${orgId}/notes/${note.id}` })
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="flex flex-col overflow-visible">
      <div 
        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={handleSelect}
      >
        <div className="shrink-0">
          {note.isFolder ? (
            <div className="h-4 w-4 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
               {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          ) : (
            <FileText className={`h-3.5 w-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
          )}
        </div>

        {note.isFolder && <Folder className="h-3.5 w-3.5 shrink-0 fill-current opacity-40" />}
        <div className="flex-1 truncate py-1">
          <div className="truncate font-bold tracking-tight">
             {note.title || (note.isFolder ? t('notes.untitled_folder') : t('notes.untitled'))}
          </div>
        </div>

        <div className="hidden group-hover:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
           {note.isFolder && (
             <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); onAddPage(note.id); }}>
               <Plus className="h-3.5 w-3.5" />
             </Button>
           )}
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-background/80 backdrop-blur-md border-white/20">
                <DropdownMenuItem className="text-[11px] font-bold py-2 focus:bg-primary/5" onClick={() => (window.location.href = `/homes/${orgId}/notes/${note.id}`)}>
                  <Edit2 className="mr-2 h-3.5 w-3.5" /> {t('notes.rename')}
                </DropdownMenuItem>
                
                {note.isFolder && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-[11px] font-bold py-2 focus:bg-primary/5" onClick={() => onAddPage(note.id)}>
                       <FilePlus className="mr-2 h-3.5 w-3.5 text-primary" /> {t('notes.new_page')}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-[11px] font-bold py-2 focus:bg-primary/5" onClick={() => onAddFolder(note.id)}>
                       <FolderPlus className="mr-2 h-3.5 w-3.5 text-primary" /> {t('notes.new_subfolder')}
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[11px] font-bold py-2 text-destructive focus:bg-destructive/10">
                  <Trash className="mr-2 h-3.5 w-3.5" /> {t('notes.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {note.isFolder && isOpen && (
        <div className="flex flex-col">
          {children.length > 0 ? (
            children.map(child => (
              <NoteItem 
                key={child.id} 
                note={child} 
                level={level + 1} 
                onAddPage={onAddPage} 
                onAddFolder={onAddFolder} 
                allNotes={allNotes} 
              />
            ))
          ) : (
            <div 
              className="py-1.5 px-3 text-[10px] text-muted-foreground/40 font-bold italic"
              style={{ paddingLeft: `${(level + 1) * 12 + 24}px` }}
            >
              {t('notes.empty_folder')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
