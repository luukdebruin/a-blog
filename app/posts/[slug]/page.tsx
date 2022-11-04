import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'

async function getPosts() {
  const files = fs.readdirSync('posts')
  const posts = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', ''),
    },
  }))
  return posts
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.params.slug,
  }))
}

export default async function PostPage({params}: any) {
  const { slug } = params
  let fileName
  try {
    fileName = fs.readFileSync(`posts/${slug}.md`, 'utf-8')
  } catch (err) {
    console.log(err)
    return 
  }

  if (!fileName) {
    return
  }

  const { data: frontmatter, content } = matter(fileName)
  return <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} className="markdown-body" />
  }
  