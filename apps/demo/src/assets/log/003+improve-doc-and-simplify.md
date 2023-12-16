---
title: Improve doc and simplify
date: '2022'
slug: improve-doc-and-simplify
id: '003'
tags: ['doc', 'dependencies', 'markdown']
---

## Context and Problem

I want to minimize maintenance and dependency management

- Remove features of repo that are overkill

Libraries I don't want to maintain for now:

- ADR libraries (used rto generate architectural decision logs)
- Storybook (it is very heavy on dependencies, forces me to include React in my project)

But I still want to document my project efficiently

## Considered Options

Considered:

- [mdsvex](https://mdsvex.pngwn.io/)
  - ✅ simple and flexible
  - ✅ based on Svelte
  - ❓feature complete
  - ❓can be easily used for styleguide
  - ❌ old Svelte version
- [bookit](https://github.com/leveluptuts/bookit)
  - ✅ based on Svelte
  - ❓feature complete
  - ❓can be easily used for more than styleguide
  - ❌ light on doc
- [Histoire](https://histoire.dev/)
  - ✅ feature rich and flexible
  - ✅ replaces Storybook
  - ❓can be easily used for more than styleguide
  - ❓dependencies
  - ❌ based on Vue (but has project for Svelte)

## Decision

### ➖ Removed

To simplify maintenance, I will stop using the ADR system, as it is also a bit overkill

- https://adr.github.io/madr/
- https://arc42.org/overview
- https://hsc.aim42.org/documentation/hsc_arc42.html
- https://biking.michael-simons.eu/docs/index.html#section-introduction-and-goals
- https://github.com/joelparkerhenderson/architecture-decision-record

Removed dependencies in root package.json:

```json
"dependencies": {
	"adr-log": "2.2.0",
	"madr": "2.1.2"
}
```

Removed scripts in root package.json:

```json
"scripts": {
    "build:doc": "adr-log -d ./packages/doc/decisions",
    "build:design": "node  ./packages/design/node_modules/.bin/build.js",
    "build": "npm run build:doc",
},
```

Removed storybook

This was a lot dependecy renmovals. I actually considered and made this decision while upgrading to the RC version of SvelteKit.
I departed from a fresh SvelteKit lib project for the **ui** package, and it did not include storybook. I then felt I did not to want to add it back (see reasons at the start of this document).

### ➕ Kept or added

ADR templates are useful, I'm keeping them for reference and for decision docs.

🚧 Chosen option for doc: [mdsvex](https://mdsvex.pngwn.io/)

- Used [mdsvex svelte adder](https://github.com/svelte-add/mdsvex) which went smoothly using this command for pnpm:

```bash
pnpm dlx svelte-add@latest mdsvex
```

- It wasn't very clear how to load markdown files dynamically - this post helped : [Build a static site with SvelteKit#Two ways to load Markdown](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog#two-ways-to-load-markdown)
