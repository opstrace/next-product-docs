import { render } from '@testing-library/react'
import { Documentation } from '../src/'
import { pageProps } from '../src/serialize'
import nock from 'nock'
import { describe, it, expect, beforeEach } from 'vitest'
import 'whatwg-fetch'
import { afterAll } from 'vitest'

const { ...originalEnv } = process.env

beforeEach(async () => {
  const docOneFixture = `
  ---
  description: Some description.
  ---

  # First Level

  ## Second Level One

  First Paragraph.

  ## Second Level Two

  Second Paragraph.
  `

  process.env.DOCS_ORG = 'DOCS_ORG'
  process.env.DOCS_REPO = 'DOCS_REPO'
  process.env.DOCS_BRANCH = 'DOCS_BRANCH'
  process.env.DOCS_FOLDER = 'DOCS_FOLDER'

  // mock github response
  nock(
    `https://raw.githubusercontent.com/${process.env.DOCS_ORG}/${process.env.DOCS_REPO}/${process.env.DOCS_BRANCH}`
  )
    .defaultReplyHeaders({
      'access-control-allow-origin': '*',
      'access-control-allow-credentials': 'true'
    })
    .get(`/${process.env.DOCS_FOLDER}/manifest.json`)
    .reply(200, {
      routes: [
        {
          heading: true,
          title: 'Top level',
          routes: [
            {
              title: 'Docs One',
              path: `/${process.env.DOCS_FOLDER}/one.md`
            }
          ]
        }
      ]
    })
    .get(`/${process.env.DOCS_FOLDER}/one.md`)
    .reply(200, docOneFixture)
    .persist()
})

afterAll(async () => {
  process.env = originalEnv
})

describe('Document', () => {
  it('should render', async () => {
    const { source } = await pageProps({ params: { slug: ['one'] } })
    const { container } = render(<Documentation source={source} />)
    expect(container).toMatchSnapshot()
  })
})
