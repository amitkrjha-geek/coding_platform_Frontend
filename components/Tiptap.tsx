'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import { Toolbar } from './Toolbar';
import { useEffect } from 'react';
// import { headers } from 'next/headers';

const Tiptap = ({problemStatement, onChange}: {problemStatement: string, onChange: (richText: string) => void}) => {
 
  const editor = useEditor({
    extensions: [StarterKit.configure({}),
      Heading.configure({
       HTMLAttributes: {
        class: 'text-2xl font-bold',
        level: 2,
       },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'list-disc',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal',
        },
      }),
    ],
    content: problemStatement,
    editorProps:{
      attributes:{
        class: 'min-h-[500px] focus:outline-none border p-8',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // console.log(editor.getHTML());
    },
  });

  // Update content when problemStatement prop changes (external updates)
  useEffect(() => {
    if (editor && problemStatement !== editor.getHTML()) {
      editor.commands.setContent(problemStatement);
    }
  }, [problemStatement, editor]);

  return (
    <div className='flex flex-col gap-2 '>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap;
