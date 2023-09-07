# Parliament Watch 👀

Citizens are watching

**Table of Content**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Environment](#environment)
- [Tech Stack](#tech-stack)
- [Set Up](#set-up)
- [Using the Design System](#using-the-design-system)
  - [Typography](#typography)
  - [Colors](#colors)
  - [Components](#components)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Environment

| Name       | URL                                |
| ---------- | ---------------------------------- |
| Staging    | https://parliament-watch.pages.dev |
| Production | -                                  |

## Tech Stack

- [Svelte](https://svelte.dev) + [SvelteKit](https://kit.svelte.dev)
- [Carbon Design System (v10)](https://v10.carbondesignsystem.com) + [Carbon Components Svelte](https://carbon-components-svelte.onrender.com)
- [TailwindCSS](https://tailwindcss.com)

## Set Up

1. Install dependencies with Yarn

```bash
yarn
```

2. Run in development mode

```bash
yarn dev
```

## Using the Design System

The project design system is based on Carbon Design System with some modification.

### Typography

- The utility classes is globally available as declared in [typography.scss](src/styles/typography.scss)
- See [Figma design file](<https://www.figma.com/file/wydykFjb2U2SLFIz5YmiE8/(v11)-Text-Styles---IBM-Design-Language-(Community)>)

### Colors

- Color scheme are defined in
  - [colors.scss](src/styles/colors.scss) as a global sass variable
  - [tailwind.config.js](tailwind.config.js) which can be used in Tailwind utility classes
- See [Figma design file](<https://www.figma.com/file/DLpm4GWpqa1BUEWApXGeGc/Color-Styles---IBM-Design-Language-(Community)>)

### Components

Use [Carbon Components Svelte](https://carbon-components-svelte.onrender.com)

- Avoid developing new component from scratch if not nessesary.
- We import only nessesary Carbon's stylesheet. After adding a new component, please uncomment coresponded import statement in [carbon.scss](src/styles/carbon.scss)
