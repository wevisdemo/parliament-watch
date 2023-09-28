# 👀 Parliament Watch

Citizens are watching

**Table of Content**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [🌎 Environments](#-environments)
- [🍱 Tech Stack](#-tech-stack)
  - [Front-end](#front-end)
  - [Local development](#local-development)
  - [Deployment pipeline](#deployment-pipeline)
- [🪄 Set Up](#-set-up)
- [🍭 Design System](#-design-system)
  - [Typography](#typography)
  - [Colors](#colors)
  - [Components](#components)
  - [Icons](#icons)
- [💾 Data Models](#-data-models)
- [🤝 Contribution Guideline](#-contribution-guideline)
- [📜 License and Terms of Use](#-license-and-terms-of-use)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🌎 Environments

| Name                   | URL                                |
| ---------------------- | ---------------------------------- |
| Branch Preview         | Provided by Cloudflare Pages       |
| Staging (main branche) | https://parliament-watch.pages.dev |
| Production             | -                                  |

## 🍱 Tech Stack

### Front-end

- [Svelte](https://svelte.dev) + [SvelteKit](https://kit.svelte.dev)
- [Carbon Design System (v10)](https://v10.carbondesignsystem.com) + [Carbon Components Svelte](https://carbon-components-svelte.onrender.com)
- [TailwindCSS](https://tailwindcss.com)

### Local development

- [Yarn v1](https://classic.yarnpkg.com) as a package manager
- Husky and lint-staged will
  - Lint (ESLint) and format (Prettier) code before commiting
  - Validate that commit message is align with [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) using commitlint
  - Run svelte-check before pushing
- For VSCode user, format on save is enabled and [prettier-vscode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) will be recommended when open the project.

### Deployment pipeline

- [Cloudflare Pages](https://pages.cloudflare.com) will automatically deploy staging (main branch) and per branch preview.

## 🪄 Set Up

1. Install dependencies with Yarn

```bash
yarn
```

2. Run in development mode

```bash
yarn dev
```

## 🍭 Design System

The project design system is based on Carbon Design System v10 with some modification. Custom theme is defined with scss in [src/styles/carbon/](src/styles/carbon/). To reduce overhead on development, we compile Carbon related stylesheet into _src/styles/carbon/precompiled.css_ with `yarn compile:sass` command.

### Typography

- The utility classes is globally available as declared in [typography.scss](src/styles/typography.scss)
- See [Figma file](<https://www.figma.com/file/wydykFjb2U2SLFIz5YmiE8/(v11)-Text-Styles---IBM-Design-Language-(Community)>)

### Colors

- [tailwind.config.js](tailwind.config.js) define utility classes based on color function name according to the Carbon's theme (see [Figma file](<https://www.figma.com/file/JhpIXQHbn07yn2GVD806dA/(v10)-White-Theme---Carbon-Design-System-(Community)>))
- [colors.scss](src/styles/carbon/colors.scss) define global sass variable of all color palette (see [Figma file](<https://www.figma.com/file/DLpm4GWpqa1BUEWApXGeGc/Color-Styles---IBM-Design-Language-(Community)>))

### Components

- Use [Carbon Components Svelte](https://carbon-components-svelte.onrender.com)
- We have custom shared component available in [src/components/](src/components/) when needed. See all planned component in [Figma file.]()
- Avoid developing new component from scratch if not nessesary. (Please check from the above sources first)

### Icons

- Use [Carbon Icons Svelte](https://carbon-icons-svelte.onrender.com)
- We have customed icon available in [src/components/icons](src/components/icons), using the same props as Carbon's icon.
- See [Figma file](<https://www.figma.com/file/TUob8dLak4FMugrqMQRm3R/Icons---IBM-Design-Language-(Community)>)

## 💾 Data Models

ER Diagram and TypeScript's interfaces are avaiable in [src/models](src/models)

## 🤝 Contribution Guideline

- For each issue, create a new branch name in the format of `username/issuenumber-description`
- Add issue number as a commit message scope eg. `feat(issuenumber): commit description`
- Open the pull requests (PR), with the same name of the issue, when you need a discussion or ready to be reviewed.

## 📜 License and Terms of Use

Read more at [WeVis's Terms of Use](https://wevis.info/terms-of-use/) (in Thai)
