import { visit } from 'unist-util-visit'

export default function relativeLinks(options) {
  let pathParts = []
  if (!options || !options.prefix) {
    throw Error('Missing required "prefix" option')
  }

  if (!options.extensions) {
    options.extensions = ['.mdx', '.md']
  }

  function visitor(node) {
    if (node && node.url && !node.url.startsWith('http')) {
      // ignore mailto: links
      if (node.url.startsWith('mailto:')) {
        return
      }

      // this helps to debug special cases
      // console.log(node, options)

      const isTargetLink = node.url.startsWith('#')

      // handle relative paths
      if (isTargetLink) {
        if (options.slug[0] === options.prefix) {
          pathParts = options.slug.slice(1)
        } else {
          pathParts = options.slug
        }
      } else if (options.slug && Array.isArray(options.slug)) {
        if (options.slug[0] === options.prefix) {
          options.slug.shift()
        }
        if (options.slug.length === 1 && options.slug[0] !== 'README') {
          pathParts = options.slug
        } else if (options.slug.length > 1) {
          const depth = (node.url.match(/\.\.\//g) || []).length
          const removeLast = options.slug.length - depth - 1
          pathParts = options.slug.slice(0, removeLast)
        }
      }

      if (pathParts[pathParts.length - 1] === 'README') {
        pathParts.pop()
      }
      // special case for links followed by "the muffet", as they sometimes have README twice in the path
      if (pathParts[pathParts.length - 1] === 'README') {
        pathParts.pop()
      }

      if (node.url.startsWith('/')) {
        node.url = node.url.replace('/', '')
      }

      if (node.url.startsWith('./')) {
        node.url = node.url.replace('./', '')
      }

      if (node.url.startsWith('../')) {
        node.url = node.url.replace(/\.\.\//g, '')
      }

      let path = ''
      if (pathParts && pathParts.length >= 1) {
        path = pathParts.join('/')
        path += '/'
      }

      node.url = `/${options.prefix}/${path}${node.url}`

      for (const ext of options.extensions) {
        if (node.url.includes(ext)) {
          node.url = node.url.replace(ext, '')
        }
      }

      if (node.url.includes('README')) {
        node.url = node.url.replace('README', '')
      }
    }
  }

  function transform(tree) {
    visit(tree, ['link'], visitor)
  }

  return transform
}
