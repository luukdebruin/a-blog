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

  return (
      <div>
        {posts.map((post) => {
          return (
            <Frontmatter post={post}/>
          )
        })}
      </div>
    )
  }
  