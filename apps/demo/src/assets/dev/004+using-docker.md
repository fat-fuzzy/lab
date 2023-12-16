---
title: Using Docker
date: '2023-02-18'
updated: '2023-05-17'
slug: using-docker
id: '004'
tags: ['example', 'doc', 'docker', 'wip']
---

## Use Cases

Use the Dockerfile with instructions below if you want to deploy any of the `apps/*` packages in a Docker container.

The `Dockerfile` is provided as an example, to be adapted to the specific requirements of your server and hosting setup.

As is, it creates an image for the `@fat-fuzzy/doc` package only.

[TODO] FIX bugs on loading `doc/ui`, `doc/log`, and `doc/dev` pages:

```shell
[error] 30#30: *2 open() "/usr/share/nginx/html/ui/__data.json" failed (2: No such file or directory)
```

```shell
[error] 30#31: *5 open() "/usr/share/nginx/html/log/__data.json" failed (2: No such file or directory)
```

```shell
[error] 30#30: *6 open() "/usr/share/nginx/html/dev/__data.json" failed (2: No such file or directory)
```

## Requirements

- Docker
- pnpm
- Turborepo

## Getting started

### 1. Change the adapters

For the Docker builds to work, the adapters in the following projects need to change :

- `packages/ui` : remove `@sveltejs/adapter-cloudflare` from `package.json` and install `@sveltejs/adapter-auto` as a dev dependency:

```shell
pnpm i --save-dev @sveltejs/adapter-auto
```

For the default Dockerfile:

- `apps/doc` : remove `@sveltejs/adapter-cloudflare` from `apps/doc/package.json` and install `@sveltejs/adapter-auto` as a dev dependency:

```shell
pnpm i --save-dev @sveltejs/adapter-static
```

If you want to use the Dockerfile for the `@fat-fuzzy/sandbox` project:

- `apps/sandbox` : remove `@sveltejs/adapter-cloudflare` from `apps/sandbox/package.json` and install `@sveltejs/adapter-auto` as a dev dependency:

```shell
pnpm i --save-dev @sveltejs/adapter-auto
```

### 1. Update Svelte Configs

In `packages/ui` change the `svelte.config.js`:

Change the line that says :

```javascript
import adapter from '@sveltejs/adapter-cloudflare'
```

to :

```javascript
import adapter from '@sveltejs/adapter-auto'
```

Then change the following line :

```javascript
kit: {
   adapter: adapter(), // this line
   ...
}
```

to:

```javascript
kit: {
   adapter: adapter({
      fallback: 'index.html',
   }),
   ...
}
```

Do the same for `apps/doc` and if necessary to `apps/sandbox`, using the respective adapters

### Creating an App image

Run **apps/doc** site in a docker container

Build

```shell
 docker build -t rocks-image .
```

Run app on port 5173

```shell
docker run -t -p 5173:80 rocks-image
```

### Troubleshooting

1. Remove code until it builds, then see what is inside image using shell:

   ```shell
   docker run -it rocks-image sh
   ```

1. See what the output of turbo is:

   ```shell
   pnpm turbo prune --scope="packagename" --docker
   ```

## Using docker-compose

[**TODO:**]

```shell
docker-compose build rocks-image
docker-compose up -d rocks-image
```

## Examples

When is this usage appropriate: see Use Cases 👆

[**TODO:**]

## Resources

The `Dockerfile` was created based on the following example:

[Turborepo Examples: Dockerfile](https://github.com/vercel/turbo/blob/main/examples/with-docker/apps/web/Dockerfile)
