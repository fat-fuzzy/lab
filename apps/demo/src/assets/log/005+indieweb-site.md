---
title: Indieweb site
date: '2022'
slug: indieweb-site
id: '005'
tags: ['indieweb', 'app', 'rust']
---

## Context and Problem

I want to be able to publish content on the internet independently of intermediary third party publishing mediums. These platforms have some benefits, primarily (but not unquestionably) the benefit of reach, but many of them lack severely in other areas:

- overreaching tracking practices and / or disregard for privacy
- questionable or opaque usage of user data
- black box algorithms
- siloed users and content
- excessive and / or invasive publicity
- Terms & Conditions that are difficult to navigate and understand and which can evolve at a moment's notice
- unpredictable outcome of the platform itself, which can lead to unwanted loss of data

Having a website that implements the [IndieWeb](https://indieweb.org/) [standards](https://spec.indieweb.org/) is a way to reclaim ownership over published content. It makes it possible to do so without having to forego access to many of the third party platforms mentioned above, albeit some make the task easier than others. It also opens up the possibility of connecting to other websites that implement the IndieWeb standards.
A longer list of [why make a website (from the IndieWeb perspective)](https://indieweb.org/why)

I want to make an IndieWeb site. This does take a bit of involvement and the acquisition of new understanding.
It makes sense to make a **new package indiesite** that contains an _indiewebified_ website template.
This will allow me to track and document that work. And to use the template of course.

## Considerations

IndieWeb references:

- [IndieWeb Standards](https://spec.indieweb.org/)
- [IndieWebify.me - Step by step guide](https://indiewebify.me/)

### Tools

- https://microformats.org/
- https://indieweb.org/Micropub
- https://indieweb.org/IndieAuth
- https://indieweb.org/POSSE
- https://indieweb.org/backfeed
- https://indieweb.org/IndieMark
- https://indieweb.org/social_reader
  - https://aaronparecki.com/2018/04/20/46/indieweb-reader-my-new-home-on-the-internet
  - https://aaronparecki.com/2018/03/12/17/building-an-indieweb-reader
- Rust: https://docs.rs/indieweb/latest/indieweb/index.html

## Decision

I will work on the implementation of IndieWeb template in parallel to other parts of the project

🚧 WIP

- using it as an excuse to pick up Rust
