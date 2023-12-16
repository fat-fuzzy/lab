---
title: Document decisions
date: '2022'
slug: document-decisions
id: '000'
tags: ['architecture', 'doc', 'dependencies']
---

## Context and Problem

I want to document the architectural choices I make in this application

Which format and structure should these records follow? In other words: How?

## Considered Options

- [MADR](https://adr.github.io/madr/) 2.1.2 – The Markdown Architectural Decision Records
- Formless – No conventions for file format and structure

## Decision

Chosen option: to base myself on "MADR 2.1.2", because

- Implicit assumptions should be made explicit
- Design documentation is important to understand the decisions later on and make reasoned choices
- The MADR format appears lean and uses Markdown
- The MADR structure is comprehensible and hopefully will facilitate usage & maintenance
- Adherence to the format will likely not be strict as this is the first time I start doing this
