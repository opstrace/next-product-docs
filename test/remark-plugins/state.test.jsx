import React from 'react'
import remarkState from '../../src/lib/remark-plugins/state/index.js'
import { render } from '@testing-library/react'
import { State, Observe } from 'mdx-observable'
import Interpolate from '../../src/components/Interpolate'
import userEvent from '@testing-library/user-event'
import MDX from '@mdx-js/runtime'
import { describe, it, expect } from 'vitest'

const markdown = `
<!--export-to-input-->

~~~bash
export OPSTRACE_CLUSTER_NAME=<choose_a_name>
~~~

<!--/export-to-input-->

~~~bash
./opstrace destroy aws $OPSTRACE_CLUSTER_NAME
~~~
`

describe('remarkState', () => {
  it('test parsing', async () => {
    const testComponent = render(
      <MDX
        components={{
          Interpolate,
          State,
          Observe
        }}
        remarkPlugins={[remarkState]}
      >
        {markdown}
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
  })
})
