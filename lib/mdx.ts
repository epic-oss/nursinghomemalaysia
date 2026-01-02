import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { extractHeadings, type Heading } from './mdx-headings'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  image?: string
  author?: string
  content: string
  readingTime: string
  headings: Heading[]
}

export interface LocationPage {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  image?: string
  location: string
  state: string
  content: string
}

export function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), 'content/blog')

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)

  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        keywords: data.keywords || [],
        image: data.image,
        author: data.author || 'Nursing Home MY',
        content,
        readingTime: readingTime(content).text,
        headings: extractHeadings(content),
      }
    })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/blog', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      keywords: data.keywords || [],
      image: data.image,
      author: data.author || 'Nursing Home MY',
      content,
      readingTime: readingTime(content).text,
      headings: extractHeadings(content),
    }
  } catch {
    return null
  }
}

export function getLocationPages(): LocationPage[] {
  const locationsDirectory = path.join(process.cwd(), 'content/locations')

  // Check if directory exists
  if (!fs.existsSync(locationsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(locationsDirectory)

  const locations = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(locationsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        keywords: data.keywords || [],
        image: data.image,
        location: data.location,
        state: data.state,
        content,
      }
    })

  return locations
}

export function getLocationPage(slug: string): LocationPage | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/locations', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      keywords: data.keywords || [],
      image: data.image,
      location: data.location,
      state: data.state,
      content,
    }
  } catch {
    return null
  }
}
