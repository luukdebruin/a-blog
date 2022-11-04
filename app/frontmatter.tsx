import React from 'react'
import Link from 'next/link'

export default function Frontmatter({ post }: any) {
    return (
      <Link href={`/posts/${post.slug}`} key={post.slug} className="w-full py-4 px-4 mb-4 block bg-slate-50 hover:bg-slate-100 ease-in-out duration-300 rounded-lg">
        <h2 className='text-2xl font-bold text-slate-700'>{post.frontmatter.title}</h2>
        <p className='text-lg mb-2'>{post.frontmatter.metaDesc}</p>
        <div className='flex'>{post.frontmatter.tags.map((tag: string) => <p className='mr-2 text-slate-400'>#{tag}</p>)}</div>
      </Link>
    )
  }
  