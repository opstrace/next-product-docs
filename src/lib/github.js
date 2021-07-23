const RAW_GITHUB_URL =
  process.env.NEXT_PUBLIC_RAW_GITHUB_URL || 'https://raw.githubusercontent.com'

function getErrorText(res) {
  try {
    return res.text()
  } catch (err) {
    return res.statusText
  }
}

async function getError(res, path) {
  const errorText = await getErrorText(res)
  const error = new Error(
    `GitHub raw download error (${path} - ${res.status}): ${errorText}`
  )

  error.status = res.status
  error.headers = res.headers.raw()

  return error
}

export async function getRawFileFromGitHub(path) {
  const options = {}
  if (process.env.GITHUB_TOKEN) {
    options.headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    }
  }
  const res = await fetch(RAW_GITHUB_URL + path, options)
  if (res.ok) return res.text()
  throw await getError(res, path)
}

export function getRawFileFromRepo(path) {
  const org = process.env.DOCS_ORG
  const repo = process.env.DOCS_REPO
  const tag = process.env.DOCS_BRANCH
  return getRawFileFromGitHub(`/${org}/${repo}/${tag}${path}`)
}
