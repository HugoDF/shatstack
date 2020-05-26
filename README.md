# SHATstack

The wonderful, HTML-driven SHATstack (subset of the JAMstack), includes:

- Serverless
- HTML
- Alpine.js
- TailwindCSS

SHATStack, a Dumpster fire of a stack for people who have had enough of acronyms

It's back to basics everyone:

How do I create a new page? Create a HTML, load up Alpine.js and Tailwind CSS from CDN and get coding.

Find the examples in the [pages](./pages) directory.

Alternative way to create a new page: use `node ./scripts/new.js your-page-name` in this repo 😂. It'll copy [pages/example-template.html](./pages/example-template.html) to `pages/your-page-name.html`.

CLI coming soon.

## Requirements

- Node 10
- Yarn 1.x or npm

## Setup

1. Clone the repository
2. Run `yarn` or `npm install` installs all required dependencies.

## npm scripts

> Equivalent `npm run <script>` should also work

- `yarn start` will start a local dev server using [serve](https://github.com/zeit/serve)
- `yarn format` will run prettier on the HTML pages.
- `yarn build` will
  - clean `dist`
  - create a `dist/index.html` from files in the `pages` directory
  - take references to CDN stylesheets and inline the styles that are used in each HTML page

## LICENSE

Code is licensed under the [MIT License](./LICENSE).
