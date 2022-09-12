/* eslint-disable react/display-name */
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
// import { State, Observe } from 'mdx-observable'
// import Tabs, { Tab } from './components/Tabs.jsx'
// import Interpolate from './components/Interpolate.jsx'
import * as Scroll from 'react-scroll'
import CodeBlock from './components/CodeBlock.jsx'
import InlineCode from './components/InlineCode.jsx'

export function Documentation({ source, theme, additionalComponents = {} }) {
  const components = Object.assign(
    {
      Element: ({ name, ...props }) => {
        return (
          <Scroll.Element
            // remove name from parent div
            name={props.children[0]?.props?.id === name ? null : name}
            {...props}
          />
        )
      },
      pre: (props) => <CodeBlock {...props} theme={theme} />,
      code: (props) => <InlineCode {...props} theme={theme} />
    },
    additionalComponents
  )
  console.log(components)

  return <MDXRemote {...source} components={components} theme={theme} />
}
