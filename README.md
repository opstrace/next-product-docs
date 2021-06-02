<p align="center">
  <img src="assets/opstrace-docs.png">
</p>

<p align="center">
  <a href="https://github.com/opstrace/next-product-docs/actions/workflows/publish.yml"><img alt="test status" src="https://github.com/opstrace/next-product-docs/actions/workflows/publish.yml/badge.svg" /></a>
  <a href="https://github.com/opstrace/next-product-docs/actions/workflows/test.yml"><img alt="test status" src="https://github.com/opstrace/next-product-docs/actions/workflows/test.yml/badge.svg" /></a>
  <a href="https://semantic-release.gitbook.io/semantic-release/"><img alt="Semantic Release bagde" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" /></a>
</p>

# Next.js Component for Product Docs

This component helps you to render your product documentation (`/docs`) on your
product website.
[Check out the Opstrace Docs for a full impression](https://opstrace.com/docs)
what this component does. Typically the website and product (+docs) are in
separate repositories. This library offers three key functions:

1. `staticPaths` returns all available paths for static site generation in
   next.js
2. `pageProps` returns the required content such as sidebar routes, Table of
   Contents and Markdown
3. `Documentation` is a JSX function that contains the render function

You can read more about the whys and hows of this component in the
[Opstrace Blog](http://opstrace.com/blog/product-documentation-with-nextjs)

## Prerequisites

The main purpose of this component is to fetch and render Markdown from a
different repo. In this folder you need to create a `manifest.json` file which
contains the link structure for the documentation you want to show. This allows
you to control the sidebar levels and titles for links.

Sample:

```
/docs
/docs/README.md
...
```

Manifest:

```json
{
  "routes": [
    {
      "heading": true,
      "title": "Next Docs Documentation",
      "routes": [
        {
          "title": "Introduction",
          "path": "/docs/README.md"
        }
      ]
    }
  ]
}
```

You can find
[complete example here](https://github.com/zentered/next-product-docs-example/blob/main/docs/manifest.json)
or check out the
[Opstrace Documentation Manifest](https://github.com/opstrace/opstrace/blob/main/docs/manifest.json).

## Installation & Usage

In your Next.js website repo, run:

    yarn add next-product-docs

or

    npm install next-product-docs

The location of your product docs can be configured through environment
variables in your `.env` file:

```
GITHUB_TOKEN=
DOCS_FOLDER=docs
DOCS_ORG=zentered
DOCS_REPO=next-product-docs-example
DOCS_BRANCH=main
DOCS_FALLBACK=README
ASSETS_DESTINATION=/assets
```

Create a new page `pages/docs/[[...slug]].jsx` which calls the provided
`staticPaths` and `pageProps` functions:

```
import Head from 'next/head'
import {
  pageProps,
  staticPaths
} from 'next-product-docs/serialize'
import Documentation from 'next-product-docs'

export default function Docs({ title, source }) {
  return (
    <main>
      <Documentation source={source} />
    </main>
  )
}

export async function getStaticPaths() {
  const paths = await staticPaths()
  return { paths, fallback: false }
}

export async function getStaticProps(ctx) {
  return {
    props: {
      ...(await pageProps(ctx))
    }
  }
}
```

## Additional Components

For convenience we're providing two additional components that help you get
started with a sidebar and table of contents. They contain styling classes, so
you should customize them as you

- [Sidebar](https://github.com/zentered/next-product-docs-example/blob/main/components/Sidebar.jsx)
- [Table of Contents (TOC)](https://github.com/zentered/next-product-docs-example/blob/main/components/Toc.jsx)

You can modify the page `[[slug]].jsx` and pass on `sidebarRoutes` and
`tocHeadings`, which contain the (nested) routes for the sidebar and toc. We're
using `react-scroll` to highlight the current section of the page in the table
of contents. In the sidebar you can easily integrate search for example with
[Algolia React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/).
