import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical, Trash, Edit2 } from 'lucide-react'
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
  // ... other properties
}

interface NoteSidebarProps {
  notes: Note[]
  isLoading: boolean
  onAddPage: (parentId?: string) => void
  onAddFolder: (parentId?: string) => void
}

export function NoteSidebar({ notes, isLoading, onAddPage, onAddFolder }: NoteSidebarProps) {
  // Build tree in memory
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

  return (
    <div className="flex flex-col gap-0.5">
      {buildTree(null).map(note => (
        <NoteItem 
           key={note.id} 
           note={note} 
           allNotes={notes} 
           onAddPage={onAddPage} 
           onAddFolder={onAddFolder} 
           depth={0}
        />
      ))}
      
      {notes.length === 0 && (
        <div className="mt-10 px-4 text-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">No notes yet</p>
          <Button 
            variant="link" 
            className="text-[11px] h-auto p-0 mt-2 text-primary font-bold"
            onClick={() => onAddPage()}
          >
            Create first page
          </Button>
        </div>
      )}
    </div>
  )
}

function NoteItem({ note, allNotes, onAddPage, onAddFolder, depth }: { 
  note: Note, 
  allNotes: Note[], 
  onAddPage: (parentId?: string) => void,
  onAddFolder: (parentId?: string) => void,
  depth: number 
}) {
  const { orgId, noteId: activeNoteId } = useParams({ from: '/homes/$orgId/notes' }) as any
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)
  const children = allNotes.filter(n => n.parentId === note.id)
  const isActive = activeNoteId === note.id

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
        className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'}`}
        style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        onClick={handleSelect}
      >
        <div className="shrink-0">
          {note.isFolder ? (
            <div className="h-4 w-4 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
               {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </div>
          ) : (
            <FileText className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
          )}
        </div>

        {note.isFolder && <Folder className="h-3.5 w-3.5 shrink-0 fill-current opacity-40" />}
        <span className={`text-xs font-bold truncate flex-1 tracking-tight ${isActive ? 'text-primary' : ''}`}>
          {note.title || (note.isFolder ? 'Untitled Folder' : 'Untitled')}
        </span>

        {/* Quick Actions */}
        <div className="hidden group-hover:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
           {note.isFolder && (
             <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md hover:bg-primary/10" onClick={(e) => { e.stopPropagation(); onAddPage(note.id); }}>
               <Plus className="h-3 w-3" />
             </Button>
           )}
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-background/80 backdrop-blur-md border-white/20">
                <DropdownMenuItem className="gap-2">
                  <Edit2 className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Rename</span>
                </DropdownMenuItem>
                {note.isFolder && (
                  <DropdownMenuItem className="gap-2" onClick={() => onAddFolder(note.id)}>
                    <Folder className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">New Subfolder</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {note.isFolder && isOpen && (
        <div className="flex flex-col gap-0.5">
          {children.map(child => (
            <NoteItem 
              key={child.id} 
              note={child} 
              allNotes={allNotes} 
              onAddPage={onAddPage} 
              onAddFolder={onAddFolder} 
              depth={depth + 1}
            />
          ))}
          {children.length === 0 && depth < 3 && (
            <div 
              className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest py-1 select-none"
              style={{ paddingLeft: `${((depth + 1) * 12) + 24}px` }}
            >
              Empty
            </div>
          )}
        </div>
      )}
    </div>
  )
}
