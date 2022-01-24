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

      // handle relative paths
      if (options.slug && Array.isArray(options.slug)) {
        const depth = (node.url.match(/\.\.\//g) || []).length
        const removeLast = options.slug.length - depth - 1
        pathParts = options.slug.slice(0, removeLast)
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
    }
  }

  function transform(tree) {
    visit(tree, ['link', 'linkReference'], visitor)
  }

  return transform
}
