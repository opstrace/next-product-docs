import { expect, test } from 'vitest'
import relativeLinks from '../../src/lib/remark-plugins/links/index'

const cases = [
  {
    url: './test-remote.txt',
    prefix: 'docs',
    slug: ['guides'],
    expected: '/docs/guides/test-remote/',
    options: {
      trailingSlash: true,
      extensions: ['.txt']
    }
  },
  {
    url: './test-remote',
    prefix: 'docs',
    slug: ['guides', 'contributor', 'workflows'],
    expected: '/docs/guides/contributor/test-remote'
  },
  {
    url: 'mailto:hello@wor.ld',
    prefix: 'docs',
    slug: ['guides', 'contributor', 'workflows'],
    expected: 'mailto:hello@wor.ld'
  },
  {
    url: '../usage/kube-csr.md',
    prefix: 'docs',
    slug: ['faq', 'README'],
    expected: '/docs/usage/kube-csr'
  },
  {
    url: './kubectl.md',
    prefix: 'docs',
    slug: ['installation'],
    expected: '/docs/installation/kubectl'
  },
  {
    url: './references/concepts.md',
    prefix: 'docs',
    slug: [],
    expected: '/docs/references/concepts'
  },
  {
    url: '../../references/cli.md',
    prefix: 'docs',
    slug: ['guides', 'administrator', 'gcp-setup'],
    expected: '/docs/references/cli'
  },
  {
    url: './writing-docs.md#get-on-your-marks',
    prefix: 'docs',
    slug: ['guides', 'contributor', 'workflows'],
    expected: '/docs/guides/contributor/writing-docs#get-on-your-marks'
  },
  {
    url: '../guides/user/sending-metrics-with-prometheus.md#remote_write-configuration-block-the-basics',
    prefix: 'docs',
    slug: ['references', 'faq'],
    expected:
      '/docs/guides/user/sending-metrics-with-prometheus#remote_write-configuration-block-the-basics'
  },
  {
    url: '../faq/README.md',
    prefix: 'docs',
    slug: ['installation', 'verify'],
    expected: '/docs/faq/'
  },
  {
    url: '#managed-identity-using-aad-pod-identities',
    prefix: 'docs',
    slug: ['docs', 'configuration', 'acme', 'dns01', 'azuredns'],
    expected:
      '/docs/configuration/acme/dns01/azuredns/#managed-identity-using-aad-pod-identities'
  },
  {
    url: '#challenge-scheduling',
    prefix: 'docs',
    slug: ['concepts', 'acme-orders-challenges'],
    expected: '/docs/concepts/acme-orders-challenges/#challenge-scheduling'
  },
  {
    url: '/release-notes-1.7.md',
    prefix: 'docs',
    slug: ['release-notes', 'README'],
    expected: '/docs/release-notes/release-notes-1.7'
  },
  {
    url: './acme-dns.md',
    prefix: 'docs',
    slug: ['configuration', 'acme', 'dns01', 'README'],
    expected: '/docs/configuration/acme/dns01/acme-dns'
  },
  {
    url: '#reinstalling-cert-manager',
    prefix: 'docs',
    slug: ['installation', 'upgrading'],
    expected: '/docs/installation/upgrading/#reinstalling-cert-manager'
  },
  {
    url: '../faq/README.md#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that',
    prefix: 'docs',
    slug: ['contributing', 'policy'],
    expected:
      '/docs/faq/#kubernetes-has-a-builtin-certificatesigningrequest-api-why-not-use-that'
  },
  {
    url: '../../docs/installation/supported-releases.md',
    prefix: 'docs',
    slug: ['installation', 'supported-releases'],
    expected: '/docs/installation/supported-releases'
  },
  {
    url: '../../v1.8-docs/cli/controller.md',
    prefix: 'docs',
    slug: ['release-notes', 'release-notes-1.8'],
    expected: '/v1.8-docs/cli/controller'
  },
  {
    url: '../../docs/installation/supported-releases.md',
    prefix: 'v1.8-docs',
    slug: ['v1.8-docs', 'installation', 'helm'],
    expected: '/docs/installation/supported-releases/',
    options: { trailingSlash: true }
  },
  {
    url: './compatibility.md',
    prefix: 'v1.8-docs',
    slug: ['installation', 'helm'],
    expected: '/v1.8-docs/installation/compatibility'
  },
  {
    url: 'ingress.md#supported-annotation',
    prefix: 'docs',
    slug: ['usage', 'gateway'],
    options: { trailingSlash: true },
    expected: '/docs/usage/ingress/#supported-annotation'
  },
  {
    url: './ingress.md#supported-annotation',
    prefix: 'docs',
    slug: ['usage', 'gateway'],
    options: { trailingSlash: true },
    expected: '/docs/usage/ingress/#supported-annotation'
  }
]

test.each(cases)(
  'transform $url',
  ({ url, prefix, slug, expected, options = {} }) => {
    const transform = relativeLinks({
      prefix: prefix,
      slug: slug,
      ...options
    })
    const tree = {
      type: 'root',
      children: [
        {
          type: 'link',
          url: url
        }
      ]
    }
    transform(tree)
    expect(tree.children[0].url).toBe(expected)
  }
)

test('fails with missing prefix', () => {
  expect(() => {
    relativeLinks({})
  }).toThrow()
})
