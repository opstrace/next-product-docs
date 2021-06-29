import { getRawFileFromRepo, getReleases } from './github'

const DOCS_FOLDER = process.env.DOCS_FOLDER
const DOCS_FALLBACK = process.env.DOCS_FALLBACK

function getDocsSlug(slug) {
  return slug?.length ? slug : [DOCS_FALLBACK]
}

function removeFromLast(path, key) {
  const i = path.lastIndexOf(key)
  return i === -1 ? path : path.substring(0, i)
}

function removeVersion(slug) {
  return slug ? slug.slice(1, 1) : slug
}

export function getSlug(params, withReleases) {
  const originalSlug = withReleases ? removeVersion(params.slug) : params.slug
  const slug = getDocsSlug(originalSlug)
  return {
    slug: `/docs/${slug.join('/')}`,
    tag: withReleases ? params.slug[1] : null
  }
}

export async function fetchDocsManifest(tag) {
  const path = `/${DOCS_FOLDER}/manifest.json`
  const res = await getRawFileFromRepo(path, tag)
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

export async function getStaticPaths(tag = process.env.DOCS_BRANCH) {
  const manifest = await fetchDocsManifest(tag)
  const paths = getPaths(manifest.routes)
  paths.shift() // remove "/docs/README"
  paths.unshift(`/${process.env.DOCS_FOLDER}`)
  return paths
}

export async function getPathsFromReleases() {
  const tags = await getReleases()
  let paths = []
  for (const tag of tags) {
    const tagPaths = await getStaticPaths(tag.name)
    paths = [
      ...paths,
      ...tagPaths.map((p) => p.replace('/docs', `/docs/${tag.name}`))
    ]
  }
  return paths
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
