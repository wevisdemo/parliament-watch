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
- [🤝 Contribution Guideline](#-contribution-guideline)
- [📜 License and Terms of Use](#-license-and-terms-of-use)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🌎 Environments

| Name             | URL                                     |
| ---------------- | --------------------------------------- |
| Per Pull Request | Provided by Cloudflare Pages in each PR |
| Staging          | https://parliament-watch.pages.dev      |
| Production       | -                                       |

## 🍱 Tech Stack

### Front-end

- [Svelte](https://svelte.dev) + [SvelteKit](https://kit.svelte.dev)
- [Carbon Design System (v10)](https://v10.carbondesignsystem.com) + [Carbon Components Svelte](https://carbon-components-svelte.onrender.com)
- [TailwindCSS](https://tailwindcss.com)

### Local development

- [Yarn v1](https://classic.yarnpkg.com) as a package manager
- Husky and lint-staged will
  - Lint (ESLint) and format (Prettier) code when commiting
  - Validate that commit message is align with [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) using commitlint
- For VSCode user, format on save is enabled and [prettier-vscode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) will be recommended when open the project.

### Deployment pipeline

- [Cloudflare Pages](https://pages.cloudflare.com) will automatically deploy staging (main branch) and per pull request environment.

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

## 🤝 Contribution Guideline

- For each issue, create a new branch name in the format of `username/short-description`
- Open the pull requests (PR), with the same name of the issue, when you need a discussion or ready to be reviewed.

## 📜 License and Terms of Use

Read more at [WeVis's Terms of Use](https://wevis.info/terms-of-use/) (in Thai)
