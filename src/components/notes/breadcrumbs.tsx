import { Link } from '@tanstack/react-router'
import { ChevronRight, Home, Folder, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Note {
  id: string
  title: string
  isFolder: boolean
  parentId: string | null
}

interface NoteBreadcrumbsProps {
  currentId: string | null
  notes: Note[]
  orgId: string
}

export function NoteBreadcrumbs({ currentId, notes, orgId }: NoteBreadcrumbsProps) {
  const { t } = useTranslation()

  const getPath = (id: string | null): Note[] => {
    if (!id) return []
    const note = notes.find(n => n.id === id)
    if (!note) return []
    return [...getPath(note.parentId), note]
  }

  const path = getPath(currentId)

  return (
    <nav className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest overflow-x-auto no-scrollbar py-2">
      <Link 
        to={`/homes/${orgId}/notes` as any}
        className="flex items-center gap-1.5 hover:text-primary transition-colors shrink-0"
      >
        <Home className="h-3 w-3" />
        <span>{t('notes.title')}</span>
      </Link>

      {path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link 
            to={item.isFolder ? `/homes/${orgId}/notes/folder/${item.id}` as any : `/homes/${orgId}/notes/${item.id}` as any}
            className={`flex items-center gap-1.5 hover:text-primary transition-colors ${index === path.length - 1 ? 'text-primary' : ''}`}
          >
            {item.isFolder ? <Folder className="h-3 w-3 opacity-40" /> : <FileText className="h-3 w-3 opacity-40" />}
            <span className="max-w-[120px] truncate">
              {item.title || (item.isFolder ? t('notes.untitled_folder') : t('notes.untitled'))}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  )
}
