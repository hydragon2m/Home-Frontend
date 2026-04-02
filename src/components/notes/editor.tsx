import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote, 
  Code,
  Link as LinkIcon,
  CheckSquare,
  Table as TableIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TiptapEditorProps {
  content: string
  onChange: (json: any) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      CharacterCount,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content ? JSON.parse(content) : '',
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none min-h-[500px]',
      },
    },
  })

  // Sync content when it changes from outside (e.g. switching notes)
  useEffect(() => {
    if (editor && content) {
      const currentContent = JSON.stringify(editor.getJSON())
      if (currentContent !== content) {
        editor.commands.setContent(JSON.parse(content))
      }
    }
  }, [editor, content])

  if (!editor) return null

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Floating/Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b py-2 flex items-center gap-1 overflow-x-auto no-scrollbar mb-8 px-4">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          icon={Bold}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          icon={Italic}
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          icon={List}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleTaskList().run()} 
          isActive={editor.isActive('taskList')}
          icon={CheckSquare}
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
          icon={Quote}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')}
          icon={Code}
        />
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton 
          onClick={() => {
            const url = window.prompt('URL')
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }} 
          isActive={editor.isActive('link')}
          icon={LinkIcon}
        />
        <ToolbarButton 
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
          isActive={false}
          icon={TableIcon}
        />
      </div>

      <div className="px-4 pb-20">
        <EditorContent editor={editor} />
      </div>

      <div className="fixed bottom-6 right-6 flex items-center gap-2">
         <div className="bg-background/80 backdrop-blur-md border rounded-full px-4 py-1.5 shadow-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground">
           {editor.storage.characterCount.characters()} characters
         </div>
      </div>
    </div>
  )
}

function ToolbarButton({ onClick, isActive, icon: Icon }: { onClick: () => void, isActive: boolean, icon: any }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`h-8 w-8 rounded-lg transition-all ${isActive ? 'bg-primary/20 text-primary shadow-inner scale-95' : 'hover:bg-primary/5 text-muted-foreground'}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
