const RAW_GITHUB_URL = 'https://raw.githubusercontent.com'
import { Octokit } from '@octokit/core'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

const org = process.env.DOCS_ORG
const repo = process.env.DOCS_REPO

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

export function getRawFileFromRepo(path, tag = process.env.DOCS_BRANCH) {
  return getRawFileFromGitHub(`/${org}/${repo}/${tag}${path}`)
}

export async function getReleases() {
  const { data } = await octokit.request(`GET /repos/${org}/${repo}/releases`, {
    owner: org,
    repo
  })
  return data ? data.map((t) => ({ url: t.html_url, name: t.tag_name })) : []
}
