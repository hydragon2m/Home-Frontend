import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Folder, 
  MoreVertical, 
  Plus, 
  Trash, 
  Edit2, 
  FolderPlus, 
  FilePlus,
  LayoutGrid
} from 'lucide-react'
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
  updatedAt?: string
}

interface NoteSidebarProps {
  notes: Note[]
  isLoading: boolean
  onAddPage: (parentId?: string) => void
  onAddFolder: (parentId?: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function NoteSidebar({ notes, isLoading, onAddPage, onAddFolder, onRename, onDelete }: NoteSidebarProps) {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes' }) as any
  const navigate = useNavigate()
  
  const buildTree = (parentId: string | null = null) => {
    return notes
      .filter(n => n.parentId === parentId)
      .sort((a, b) => (a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-8 w-full animate-pulse bg-muted/40 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Navigation */}
      <div className="p-4 flex flex-col gap-1 border-b bg-muted/5">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-10 rounded-xl font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all group"
          onClick={() => navigate({ to: `/homes/${orgId}/notes` as any })}
        >
          <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
             <LayoutGrid className="h-3.5 w-3.5" />
          </div>
          {t('notes.title')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <FileText className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{t('notes.no_notes')}</p>
          </div>
        ) : (
          buildTree(null).map(note => (
            <NoteItem 
               key={note.id} 
               note={note} 
               allNotes={notes} 
               onAddPage={onAddPage} 
               onAddFolder={onAddFolder} 
               onRename={onRename}
               onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t bg-muted/5 grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-lg text-[9px] font-black uppercase tracking-wider border-primary/10 hover:bg-primary/5 shadow-none flex items-center justify-center gap-1.5"
          onClick={() => onAddPage()}
        >
          <FilePlus className="h-3 w-3 text-primary" />
          {t('notes.new_page')}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 rounded-lg text-[9px] font-black uppercase tracking-wider border-primary/10 hover:bg-primary/5 shadow-none flex items-center justify-center gap-1.5"
          onClick={() => onAddFolder()}
        >
          <FolderPlus className="h-3 w-3 text-primary" />
          {t('notes.new_folder')}
        </Button>
      </div>
    </div>
  )
}

function NoteItem({ 
  note, 
  level = 0, 
  onAddPage, 
  onAddFolder,
  onRename,
  onDelete,
  allNotes
}: { 
  note: any, 
  level?: number, 
  onAddPage: (parentId: string) => void,
  onAddFolder: (parentId: string) => void,
  onRename: (id: string, title: string) => void,
  onDelete: (id: string) => void,
  allNotes: any[]
}) {
  const { t } = useTranslation()
  const { orgId } = useParams({ from: '/homes/$orgId/notes' }) as any
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [tempTitle, setTempTitle] = useState(note.title)
  const children = allNotes.filter(n => n.parentId === note.id)
  const isSelected = window.location.pathname.includes(note.id)

  const handleSelect = () => {
    if (isRenaming) return
    if (!note.isFolder) {
      navigate({ to: `/homes/${orgId}/notes/${note.id}` as any })
    } else {
      // Toggle sidebar expansion AND navigate to folder view
      setIsOpen(!isOpen)
      navigate({ to: `/homes/${orgId}/notes/folder/${note.id}` as any })
    }
  }

  const handleRename = () => {
    if (tempTitle.trim() && tempTitle !== note.title) {
      onRename(note.id, tempTitle)
    }
    setIsRenaming(false)
  }

  return (
    <div className="flex flex-col overflow-visible">
      <div 
        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none ${isSelected ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={handleSelect}
      >
        <div className="shrink-0">
          {note.isFolder ? (
            <div className="h-4 w-4 flex items-center justify-center hover:bg-primary/10 rounded transition-colors" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
               {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          ) : (
            <FileText className={`h-3.5 w-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-foreground'}`} />
          )}
        </div>

        {note.isFolder && <Folder className={`h-3.5 w-3.5 shrink-0 fill-current opacity-40 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />}
        
        <div className="flex-1 truncate py-0.5">
          {isRenaming ? (
            <input 
              autoFocus
              className="w-full bg-background border-none px-1 text-xs font-bold focus:ring-1 ring-primary/30 rounded outline-none shadow-inner py-0.5"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') {
                  setIsRenaming(false)
                  setTempTitle(note.title)
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="truncate font-bold tracking-tight text-xs">
               {note.title || (note.isFolder ? t('notes.untitled_folder') : t('notes.untitled'))}
            </div>
          )}
        </div>

        <div className="hidden group-hover:flex items-center gap-0.5">
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
              <DropdownMenuContent align="end" className="w-44 bg-background/95 backdrop-blur-md border shadow-xl">
                <DropdownMenuItem 
                  className="text-[11px] font-bold py-2 focus:bg-primary/5" 
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsRenaming(true)
                  }}
                >
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
                <DropdownMenuItem 
                  className="text-[11px] font-bold py-2 text-destructive focus:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(t('notes.delete_confirm') || 'Are you sure you want to delete this note?')) {
                      onDelete(note.id)
                    }
                  }}
                >
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
                onRename={onRename}
                onDelete={onDelete}
                allNotes={allNotes} 
              />
            ))
          ) : (
            <div 
              className="py-1.5 px-3 text-[10px] text-muted-foreground/30 font-bold italic"
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
