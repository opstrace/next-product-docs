import React from 'react'
import remarkState from '../../src/lib/remark-plugins/state/index.js'
import { render } from '@testing-library/react'
import { State, Observe } from 'mdx-observable'
import Interpolate from '../../src/components/Interpolate'
import userEvent from '@testing-library/user-event'
import MDX from '@mdx-js/runtime'
import { describe, it, expect, afterAll } from 'vitest'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkParse from 'remark-parse'
import remarkComment from 'remark-comment'

const md = `
# Hi folks!

Here is some text for you. How are you doing today?

<!--export-to-input-->

~~~bash
export OPSTRACE_CLUSTER_NAME=<choose_a_name>
~~~

<!--/export-to-input-->

~~~bash
./opstrace destroy aws $OPSTRACE_CLUSTER_NAME
~~~
`

const mdx = `
# Hi folks!

Here is some text for you. How are you doing today?

{/* export-to-input */}

~~~bash
export OPSTRACE_CLUSTER_NAME=<choose_a_name>
~~~

{/* /export-to-input */}

~~~bash
./opstrace destroy aws $OPSTRACE_CLUSTER_NAME
~~~
`

const { ...originalEnv } = process.env

afterAll(async () => {
  process.env = originalEnv
})

describe('remarkState', () => {
  it.only('test parsing MD', async () => {
    const mdxSource = await serialize(md, { format: 'mdx',
      mdxOptions: {
        remarkPlugins: [remarkState, remarkParse, [remarkComment, { ast: true }]]
      }
    })
    const testComponent = render(
      <MDXRemote
        {...mdxSource}
        components={{
          Interpolate,
          State,
          Observe
        }}
      />
    )

    // // the commented export statement is not rendered
    // expect(
    //   testComponent.queryByText('export OPSTRACE_CLUSTER_NAME=<choose_a_name>')
    // ).not.toBeInTheDocument()

    // // default value is shown
    // expect(
    //   testComponent.getByText('./opstrace destroy aws $OPSTRACE_CLUSTER_NAME')
    // ).toBeInTheDocument()

    // // typing my custon name
    // const value = 'MyService'
    // const input = testComponent.getByRole('textbox')
    // await userEvent.type(input, value)

    // // custom name is shown
    // expect(
    //   await testComponent.findByText(`./opstrace destroy aws ${value}`)
    // ).toBeInTheDocument()

    expect(testComponent.container).toMatchInlineSnapshot(`
      <div>
        <h1>
          Hi folks!
        </h1>
        <p>
          Here is some text for you. How are you doing today?
        </p>
        <input
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-5"
          placeholder="$OPSTRACE_CLUSTER_NAME"
          type="text"
          value="MyService"
        />
        <pre>
          <code
            class="language-bash"
          >
            ./opstrace destroy aws MyService

          </code>
        </pre>
      </div>
    `)
  })

  it.skip('test parsing MDX', async () => {
    process.env.DOCS_USE_MDX = 'true'
    const testComponent = render(
      <MDX
        components={{
          Interpolate,
          State,
          Observe
        }}
        remarkPlugins={[remarkState]}
      >
        {mdx}
      </MDX>
    )

    // the commented export statement is not rendered
    expect(
      testComponent.queryByText('export OPSTRACE_CLUSTER_NAME=<choose_a_name>')
    ).not.toBeInTheDocument()

    // default value is shown
    expect(
      testComponent.getByText('./opstrace destroy aws $OPSTRACE_CLUSTER_NAME')
    ).toBeInTheDocument()

    // typing my custon name
    const value = 'MyService'
    const input = testComponent.getByRole('textbox')
    await userEvent.type(input, value)

    // custom name is shown
    expect(
      await testComponent.findByText(`./opstrace destroy aws ${value}`)
    ).toBeInTheDocument()

    expect(testComponent.container).toMatchInlineSnapshot(`
      <div>
        <h1>
          Hi folks!
        </h1>
        <p>
          Here is some text for you. How are you doing today?
        </p>
        <p>
          {/
          <em>
             export-to-input 
          </em>
          /}
        </p>
        <input
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-5"
          placeholder="$OPSTRACE_CLUSTER_NAME"
          type="text"
          value="MyService"
        />
        <pre>
          <code
            class="language-bash"
          >
            ./opstrace destroy aws MyService

          </code>
        </pre>
      </div>
    `)
  })
})
