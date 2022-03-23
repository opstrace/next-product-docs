/**
 * Forked from https://github.com/imcuttle/remark-heading-id
 * License MIT
 * @author imcuttle
 */

import { visit } from 'unist-util-visit'

export default function headingIds() {
  return function (node) {
    visit(node, 'heading', (node) => {
      let lastChild = node.children[node.children.length - 1]
      if (lastChild && lastChild.type === 'text') {
        let string = lastChild.value.replace(/ +$/, '')
        let matched = string.match(/ {#([^]+?)}$/)

        if (matched) {
          let id = matched[1]
          if (id.length) {
            if (!node.data) {
              node.data = {}
            }
            if (!node.data.hProperties) {
              node.data.hProperties = {}
            }
            node.data.id = node.data.hProperties.id = id

            string = string.substring(0, matched.index)
            lastChild.value = string
          }
        }
      }
    })
  }
}
