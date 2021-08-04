import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { State, Observe } from 'mdx-observable'
import { Element } from 'react-scroll'
import CodeBlock from './components/CodeBlock.jsx'
import InlineCode from './components/InlineCode.jsx'
import Tabs, { Tab } from './components/Tabs.jsx'
import Interpolate from './components/Interpolate.jsx'

export default function Documentation({ source, theme }) {
  const components = {
    Tabs: Tabs,
    Tab: Tab,
    Interpolate,
    State,
    Observe,
    // eslint-disable-next-line react/display-name
    Element: ({ name, ...props }) => {
      return (
        <Element
          // remove name from parent div
          name={props.children[0]?.props?.id === name ? null : name}
          {...props}
        />
      )
    },
    // eslint-disable-next-line react/display-name
    pre: (props) => <div {...props} />,
    code: CodeBlock,
    inlineCode: InlineCode
  }

  return <MDXRemote {...source} components={components} />
}
