import '@testing-library/jest-dom/extend-expect'
import fetch from 'node-fetch'

// adding fetch which does not exist in node
window.fetch = fetch

// adding env vars
process.env.DOCS_ORG = 'my-docs'
process.env.DOCS_REPO = 'my-repo'
process.env.DOCS_BRANCH = 'my-branch'
process.env.DOCS_FOLDER = 'my-docs'
process.env.DOCS_USE_MDX = false
