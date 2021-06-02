import { getRawFileFromRepo } from './github'

const DOCS_FOLDER = process.env.DOCS_FOLDER
const DOCS_FALLBACK = process.env.DOCS_FALLBACK

function getDocsSlug(slug) {
  return slug?.length ? slug : [DOCS_FALLBACK]
}

function removeFromLast(path, key) {
  const i = path.lastIndexOf(key)
  return i === -1 ? path : path.substring(0, i)
}

export function getSlug(params) {
  const slug = getDocsSlug(params.slug)
  return { slug: `/docs/${slug.join('/')}` }
}

export async function fetchDocsManifest() {
  const path = `/${DOCS_FOLDER}/manifest.json`
  const res = await getRawFileFromRepo(path)
  return JSON.parse(res)
}

export function findRouteByPath(path, routes) {
  for (const route of routes) {
    if (route.path && removeFromLast(route.path, '.') === path) {
      return route
    }
    const childPath = route.routes && findRouteByPath(path, route.routes)
    if (childPath) return childPath
  }
}

export function getPaths(nextRoutes, carry = []) {
  nextRoutes.forEach(({ path, routes }) => {
    if (path) {
      carry.push(removeFromLast(path, '.'))
    } else if (routes) {
      getPaths(routes, carry)
    }
  })

  return carry
}

export function replaceDefaultPath(routes) {
  for (const route of routes) {
    if (route.path) {
      route.path = route.path.split('.')[0]
      if (route.path.indexOf(DOCS_FALLBACK) > -1) {
        route.path = route.path.replace(DOCS_FALLBACK, '')
        // remove trailing slash
        if (route.path.endsWith('/')) {
          route.path = route.path.slice(0, -1)
        }
      }
    }
    if (route.routes) {
      replaceDefaultPath(route.routes)
    }
  }
}
