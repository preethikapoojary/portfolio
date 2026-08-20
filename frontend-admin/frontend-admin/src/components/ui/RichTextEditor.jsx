import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
} from 'react-icons/fi';

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previousUrl || 'https://');
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FiBold />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FiItalic />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FiUnderline />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FiList />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>

        <Divider />

        <ToolbarButton active={editor.isActive('link')} onClick={setLink}>
          <FiLink />
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none px-3 py-2 text-sm [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none [&_a]:text-primary [&_a]:underline"
      />
    </div>
  );
}

function ToolbarButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium ${
        active ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 my-1 w-px bg-slate-200" />;
}
