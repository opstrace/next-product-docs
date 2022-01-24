import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import { marked } from 'marked'
import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import cloneDeep from 'lodash/cloneDeep'

import remarkTabs from './lib/remark-plugins/tabs'
import remarkState from './lib/remark-plugins/state'
import remarkSections from './lib/remark-plugins/sections'
import remarkExternalLinks from 'remark-external-links'
import remarkInternalLinks from './lib/remark-plugins/links'
import remarkRewriteImages from './lib/remark-plugins/images'
import {
  findRouteByPath,
  replaceDefaultPath,
  getSlug,
  getPaths,
  fetchDocsManifest
} from './lib/docs'
import { getRawFile } from './lib/files'

const DOCS_FOLDER = process.env.DOCS_FOLDER

export async function pageProps({ params }) {
  const slugger = new GithubSlugger()
  const manifest = await fetchDocsManifest().catch((error) => {
    if (error.status === 404) return
    throw error
  })
  const { slug } = getSlug(params)
  const route = manifest && findRouteByPath(slug, manifest.routes)
  if (!route)
    return {
      notFound: true
    }
  const manifestRoutes = cloneDeep(manifest.routes)
  replaceDefaultPath(manifestRoutes)

  const mdxRawContent = await getRawFile(route.path)
  const { content, data } = matter(mdxRawContent)
  if (!data.title) {
    data.title = ''
  }
  const mdxSource = await serialize(content, {
    scope: { data },
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolink,
          {
            behavior: 'append',
            properties: {
              className: ['btn-copy-link', 'invisible']
            },
            content: {
              type: 'element',
              tagName: 'svg',
              properties: {
                className: ['h-6', 'w-6', 'ml-2', 'docs-copy-btn'],
                xmlns: 'http://www.w3.org/2000/svg',
                fill: 'none',
                viewBox: '0 0 24 24',
                stroke: 'currentColor'
              },
              children: [
                {
                  type: 'element',
                  tagName: 'path',
                  properties: {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: 2,
                    d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  },
                  children: []
                }
              ]
            }
          }
        ]
      ],
      remarkPlugins: [
        remarkSections,
        remarkTabs,
        remarkState,
        [remarkRewriteImages, { destination: process.env.ASSETS_DESTINATION }],
        [remarkExternalLinks, { target: false, rel: ['nofollow'] }],
        [
          remarkInternalLinks,
          {
            prefix: DOCS_FOLDER,
            slug: params.slug,
            extensions: ['.mdx', '.md']
          }
        ]
      ]
    },
    target: ['es2020']
  })

  const markdownTokens = marked.lexer(content)
  const headings = markdownTokens
    .filter((t) => t.type === 'heading')
    .map((heading) => {
      heading.slug = slugger.slug(heading.text)
      return heading
    })

  const title = headings && headings.length > 0 ? headings[0].text : data.title

  return {
    title,
    frontmatter: data,
    sidebarRoutes: manifestRoutes,
    route,
    source: mdxSource,
    tocHeadings: headings
  }
}

export async function staticPaths() {
  const manifest = await fetchDocsManifest()
  const paths = getPaths(manifest.routes)
  paths.shift() // remove "/docs/README"
  paths.unshift(`/${process.env.DOCS_FOLDER}`)
  return paths
}
