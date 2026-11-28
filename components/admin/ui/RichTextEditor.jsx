'use client';
import { useEffect, useRef, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
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
  FiFolder,
  FiUpload,
} from 'react-icons/fi';
import axiosClient from '@/lib/adminApi/axiosClient';
import AssetPickerModal from './AssetPickerModal';
import ImageCropModal from '@/components/common/ImageCropModal';

const InlineImage = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      title: { default: null },
    };
  },
  parseHTML() {
    return [{ tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        class: 'my-4 max-h-96 w-auto rounded border border-[#DCD9D1] object-contain',
      }),
    ];
  },
});

export default function RichTextEditor({ value, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      InlineImage,
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const next = value || '';
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const insertImage = (src, alt = '') => {
    if (!src) return;
    editor
      .chain()
      .focus()
      .insertContent([
        { type: 'image', attrs: { src, alt } },
        { type: 'paragraph' },
      ])
      .run();
  };

  const uploadAndInsertImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'portfolio/images');
      const res = await axiosClient.post('/admin/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.data?.url;
      if (url) insertImage(url, file.name);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPendingFile(file);
  };

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
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">
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

        <Divider />

        <ToolbarButton onClick={() => setPickerOpen(true)} title="Insert image from /public/assets">
          <span className="inline-flex items-center gap-1 text-xs">
            <FiFolder size={13} /> Assets
          </span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Upload and insert image"
          disabled={uploading}
        >
          <span className="inline-flex items-center gap-1 text-xs">
            <FiUpload size={13} /> {uploading ? 'Uploading…' : 'Image'}
          </span>
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          className="hidden"
        />
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none px-3 py-2 text-sm [&_.ProseMirror]:min-h-[140px] [&_.ProseMirror]:outline-none [&_a]:text-primary [&_a]:underline [&_img]:my-3 [&_img]:max-h-72 [&_img]:rounded [&_img]:border [&_img]:border-[#DCD9D1]"
      />

      <AssetPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        defaultCategory="images"
        title="Insert Image from /public/assets"
        onSelect={(asset) => {
          insertImage(asset.url, asset.name || '');
          setPickerOpen(false);
        }}
      />

      <ImageCropModal
        file={pendingFile}
        defaultAspect="original"
        onCancel={() => setPendingFile(null)}
        onConfirm={(croppedFile) => {
          setPendingFile(null);
          uploadAndInsertImage(croppedFile);
        }}
      />
    </div>
  );
}

function ToolbarButton({ active, onClick, children, title, disabled }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium disabled:opacity-50 ${
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
