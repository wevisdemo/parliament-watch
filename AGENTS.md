# Parliament Watch

## General Instructions

- Main stack of this project are SvelteKit v2, Tailwind v3, and Carbon Components Svelte
- Always use pnpm as a package manager
- The GitHub owner and repo is wevisdemo/parliament-watch
- Do not use CSS style block if not necessary, using Tailwind classes is preferableฃ
- Always name source code in kebab-case
- Avoid mutating variables, prefer functional approach when possible
- After finishing any task, run the following commands:
  - Check type with `pnpm run check --output machine`
  - Lint with `pnpm run lint`, all errors and warnings must be fixed
  - Run unit tests `pnpm vitest --run` make sure all test are passed
  - Format code with `pnpm run format` before declaring task as done
- Human will get in the loop and edit some file along the way. If you spot it, please respect those changes

## Git Commit Message Style

- Use conventional commit format
- Don't add body to the commit message. Concisely explain changes to the message title
- If the changes specific to any app or package, then add it name to the scope
