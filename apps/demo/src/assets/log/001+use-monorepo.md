---
title: Use Monorepo
date: '2022'
slug: use-monorepo
id: '001'
tags: ['architecture', 'monorepo', 'dependencies']
---

## Context and Problem

I want to have a clear view of project resources.
I want to be able to use packages independently (client, components, design resources, etc).
I want to minimize maintenance and dependency management.

## Considered Options

- [pnpm](https://pnpm.io)
- [yarn workspaces](https://yarnpkg.com/features/workspaces)
- Separate repos for each project

## Decision

Chosen option: to create a Monorepo with **pnpm**

- A Monorepo should facilitate dependency management and hopefully remove some maintenance overhead
- A Monorepo will more easily enable me to spawn new applications using shared resources
- **pnpm** is widely used by the Svelte community, and the project will use Svelte as a frontend framework (likely to find examples and resources).
