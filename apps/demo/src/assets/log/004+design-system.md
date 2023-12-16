---
title: Design System
date: '2022'
slug: design-system
id: '004'
tags: ['design', 'ui']
---

## Context and Problem

I need to have a source of truth for design decisions, and a way to ensure a better and consistent quality of front end components and UI in general. I also want to make sure that any improvements I make are reflected across the sites that use these components.
Design systems are made for this.

## Considered Options

- Do not do a design system and work in priority on other aspects (graphics library, indiewebsite)
- Do a design system and work on other subjects in parallel

## Decision

I think I can push for the stretch and try to implement a (tiny) design system.
I will build the gl lib and the indiewebsite in parallel.
The design system will make my job easier in the long run: the project is small enough to get a solid start now.

Given the scale of this project I'll borrow from this source to get me started:

Adapted from : [InVision Guide - Building an MVP Design System](https://www.invisionapp.com/lp/design-system-mvp-guide)

### Design System Overview

| UI Library  | Users     | Controls   |
| ----------- | --------- | ---------- |
| Foundations | Designers | Guidelines |
| Blocks      | Engineers | Governance |
| Layouts     |           |            |

### UI Library

| Foundations    | Layouts  | Blocks   |
| -------------- | -------- | -------- |
| Colors         | Burrito  | Buttons  |
| Typography     | Reveal   | Cards    |
| Icons (assets) | Icon     | Forms    |
| Spacing        | Sidebar  | Graphics |
| Motion         | Stack    | Media    |
| Layers         | Switcher | Navs     |
| ...            | ...      | (Tables) |
| ...            | ...      | ...      |

### 🚧 Users

| Design Assets | Engineering Assets |
| ------------- | ------------------ |
| Design files  | APIs               |
| Libraries     | Components         |
| Styles        | Tokens             |

### 🚧 Controls

| Guidelines    | Governance    |
| ------------- | ------------- |
| Accessibility | Communication |
| Examples      | Versions      |
| Usage         | Measurement   |
| Patterns      | Contribution  |
| Principles    | Incentives    |
| Voice & Tone  | Reviews       |
