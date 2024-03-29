import { render } from '@testing-library/react'
import Documentation from '../src'
import { pageProps } from '../src/serialize'
import nock from 'nock'
import userEvent from '@testing-library/user-event'

beforeAll(async () => {
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

  // mock github response
  nock(
    `https://raw.githubusercontent.com/${process.env.DOCS_ORG}/${process.env.DOCS_REPO}/${process.env.DOCS_BRANCH}`
  )
    .get(`/${process.env.DOCS_FOLDER}/manifest.json`)
    .reply(200, {
      routes: [
        {
          heading: true,
          title: 'Top level',
          routes: [
            {
              title: 'Docs One',
              path: '/docs/one.md'
            }
          ]
        }
      ]
    })
    .get(`/docs/one.md`)
    .reply(200, docOneFixture)
    .persist()
})

describe('Document', () => {
  it('should render', async () => {
    const { source } = await pageProps({ params: { slug: ['one'] } })
    const container = render(<Documentation source={source} />)
    // container.debug()
    expect(container.asFragment()).toMatchSnapshot()
  })
})
