import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

function doesHavePreviousPost(posts: any, slug: string) {
  let previousPost: any
  let currentDate: number
  const currentPost = posts.filter((post: any) => post.slug === slug)[0]
  if (currentPost && currentPost.frontmatter) {
    currentDate = Date.parse(currentPost.frontmatter.date)
  }
  posts.map((post: any) => {
    if (post.frontmatter && post.frontmatter.date) {
      const postDate = Date.parse(post.frontmatter.date)
      if (previousPost) {
        const previousPostDate = Date.parse(previousPost.frontmatter.date)
        if (currentDate > postDate && previousPostDate < postDate) {
          previousPost = post
        }
      } else if (!previousPost && currentDate > postDate) {
        previousPost = post
      }
    }
  })
  return previousPost
}

function doesHaveNextPost(posts: any, slug: string) {
  let nextPost: any
  let currentDate: number
  const currentPost = posts.filter((post: any) => post.slug === slug)[0]
  if (currentPost && currentPost.frontmatter) {
    currentDate = Date.parse(currentPost.frontmatter.date)
  }
  posts.map((post: any) => {
    if (post.frontmatter && post.frontmatter.date) {
      const postDate = Date.parse(post.frontmatter.date)
      if (nextPost) {
        const nextPostDate = Date.parse(nextPost.frontmatter.date)
        if (currentDate < postDate && nextPostDate > postDate) {
          nextPost = post
        }
      } else if (!nextPost && currentDate < postDate) {
        nextPost = post
      }
    }
  })
  return nextPost
}

async function getPosts() {
  const files = fs.readdirSync('posts')
  const posts = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    }
  })
  return posts
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({params}: any) {
  let fileName
  const { slug } = params
  const posts = await getPosts()
  const previousPost = doesHavePreviousPost(posts, slug)
  const nextPost = doesHaveNextPost(posts, slug)
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
  return (
      <div className='flex flex-col'>
        <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} className="markdown-body" />
        <div className='flex flex-row w-full mt-12'>
          {previousPost ? 
            <Link href={`posts/${previousPost.slug}`} className="flex-1 flex flex-col p-8 mr-1 bg-slate-100 hover:bg-slate-200 ease-in-out duration-300 cursor-pointer rounded-lg">
              <p>Previous post</p>
              <h2 className='text-2xl font-bold text-slate-700'>{previousPost.frontmatter.title}</h2>
            </Link>
          : 
            <div className="flex-1 flex flex-col p-8 mr-1 bg-slate-100 rounded-lg opacity-50">
              <p>Previous post</p>
              <h2 className='text-2xl font-bold text-slate-700'>No Previous Post</h2>
            </div>
          }
          {nextPost ? 
            <Link href={`posts/${nextPost.slug}`} className="flex-1 flex flex-col p-8 mr-1 bg-slate-100 hover:bg-slate-200 ease-in-out duration-300 cursor-pointer rounded-lg">
              <p>Next post</p>
              <h2 className='text-2xl font-bold text-slate-700'>{nextPost.frontmatter.title}</h2>
            </Link>
          : 
            <div className="flex-1 flex flex-col p-8 mr-1 bg-slate-100 rounded-lg opacity-50">
              <p>Next post</p>
              <h2 className='text-2xl font-bold text-slate-700'>No Next Post</h2>
            </div>
          }
        </div>
      </div>
    )
  }
  