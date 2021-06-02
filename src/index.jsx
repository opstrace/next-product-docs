import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { State, Observe } from 'mdx-observable'
import { Element } from 'react-scroll'
import {
  findRouteByPath,
  getSlug,
  getPaths,
  fetchDocsManifest
} from './lib/docs'
import CodeBlock from './components/CodeBlock.jsx'
import InlineCode from './components/InlineCode.jsx'
import Tabs, { Tab } from './components/Tabs.jsx'
import Interpolate from './components/Interpolate.jsx'

export default function Documentation({ source }) {
  const components = {
    Tabs: Tabs,
    Tab: Tab,
    Interpolate,
    State,
    Observe,
    Element,
    // eslint-disable-next-line react/display-name
    pre: (props) => <div {...props} />,
    code: CodeBlock,
    inlineCode: InlineCode
  }

  return <MDXRemote {...source} components={components} />
}
