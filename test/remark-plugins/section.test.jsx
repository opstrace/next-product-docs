import React from 'react'
import remarkSection from '../../src/lib/remark-plugins/sections/index'
import { render } from '@testing-library/react'
import MDX from '@mdx-js/runtime'
import { describe, it, expect } from 'vitest'

describe('remarkState', () => {
  it('adds sections - html', async () => {
    const markdown = `
# Hi
Here is my text

## Subthing
more sub text

## Subthing 2
more sub 22 text

# Another main thing
eeehoo

## Second subthing after first main thing
more sub text

# Leftover
more sub text
`

    const testComponent = render(
      <MDX
        components={{
          Element: ({ name, ...props }) => {
            return (
              <div
                // remove name from parent div
                name={props.children[0]?.props?.id === name ? null : name}
                {...props}
              />
            )
          }
        }}
        remarkPlugins={[remarkSection]}
      >
        {markdown}
      </MDX>
    )
    expect(testComponent.container).toMatchInlineSnapshot(`
      <div>
        <div
          name="hi"
        >
          <h1>
            Hi
          </h1>
          <p>
            Here is my text
          </p>
          <div
            name="subthing"
          >
            <h2>
              Subthing
            </h2>
            <p>
              more sub text
            </p>
          </div>
          <div
            name="subthing-2"
          >
            <h2>
              Subthing 2
            </h2>
            <p>
              more sub 22 text
            </p>
          </div>
        </div>
        <div
          name="another-main-thing"
        >
          <h1>
            Another main thing
          </h1>
          <p>
            eeehoo
          </p>
          <div
            name="second-subthing-after-first-main-thing"
          >
            <h2>
              Second subthing after first main thing
            </h2>
            <p>
              more sub text
            </p>
          </div>
        </div>
        <div
          name="leftover"
        >
          <h1>
            Leftover
          </h1>
          <p>
            more sub text
          </p>
        </div>
      </div>
    `)
  })
})
