import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import Frontmatter from './frontmatter'

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

export default async function Page() {
  const posts = await getPosts()
  const filteredPosts = posts.sort((a,b) => {
    const aDate: number = Date.parse(a.frontmatter.date)
    const bDate: number = Date.parse(b.frontmatter.date)
    return bDate - aDate
    }
  )

  return (
      <div>
        {filteredPosts.map((post) => {
          return (
            <Frontmatter key={post.slug} post={post}/>
          )
        })}
      </div>
    )
  }
  