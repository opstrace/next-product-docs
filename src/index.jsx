/* eslint-disable react/display-name */
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { State, Observe } from 'mdx-observable'
import { Element } from 'react-scroll'
import CodeBlock from './components/CodeBlock.jsx'
import InlineCode from './components/InlineCode.jsx'
import Tabs, { Tab } from './components/Tabs.jsx'
import Interpolate from './components/Interpolate.jsx'

export function Documentation({ source, theme }) {
  const components = {
    Tabs: Tabs,
    Tab: Tab,
    Interpolate,
    State,
    Observe,
    Element: ({ name, ...props }) => {
      return (
        <Element
          // remove name from parent div
          name={props.children[0]?.props?.id === name ? null : name}
          {...props}
        />
      )
    },
    pre: (props) => <div {...props} />,
    code: (props) => <CodeBlock {...props} theme={theme} />,
    inlineCode: (props) => <InlineCode {...props} theme={theme} />
  }

  return <MDXRemote {...source} components={components} theme={theme} />
}
