import relativeLinks from '../../src/lib/remark-plugins/links/index'

const cases = [
  [
    './test-remote',
    ['guides', 'contributor', 'workflows'],
    '/docs/guides/contributor/test-remote'
  ],
  ['./references/concepts.md', ['README'], '/docs/references/concepts'],
  [
    '../../references/cli.md',
    ['guides', 'administrator', 'gcp-setup'],
    '/docs/references/cli'
  ],
  [
    './writing-docs.md#get-on-your-marks',
    ['guides', 'contributor', 'workflows'],
    '/docs/guides/contributor/writing-docs#get-on-your-marks'
  ],
  [
    '../guides/user/sending-metrics-with-prometheus.md#remote_write-configuration-block-the-basics',
    ['references', 'faq'],
    '/docs/guides/user/sending-metrics-with-prometheus#remote_write-configuration-block-the-basics'
  ]
]

test.each(cases)('transform %s', (url, slug, expected) => {
  const transform = relativeLinks({ prefix: 'docs', slug: slug })
  const tree = {
    type: 'root',
    children: [
      {
        url: url,
        depth: 1,
        children: [],
        position: { start: {}, end: {} },
        type: 'link',
        data: { hProperties: {} }
      }
    ]
  }
  transform(tree)
  expect(tree.children[0].url).toBe(expected)
})
