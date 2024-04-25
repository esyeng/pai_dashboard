This is a personal AI chat server developed by Esme Keats @esyeng. All rights reserved. MIT License.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Frontend:

## Stack:
NextJS, Next-Auth, React (TypeScript), TailwindCSS, radix-ui

### Completed:
- dropdown to select model (which will open proper channel with backend) (this lives in Options.tsx
- a clean, responsive user / assistant chat window complete with input and send button. (think iMessage, chatgpt)
- a design theme with tailwindcss

### Needed:
- a user/pw authentication interface.
- a menu with sliders to adjust temperature, max tokens (to add to Options.tsx)
- a collabsible sidebar menu, open by default on desktop, or via hamburger on small viewports and/or mobile. within it:
     - a place to store simple notes, persists across sessions
     - a conversations / threads list component that allows for creating new threads, and saving them for the logged in user. active threads should persist across sessions.
               - export thread button to save formatted conversation to file

### Repo structure:
.
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── favicon.ico
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── app
│   │   ├── api
│   │   │   └── chat
│   │   ├── chat
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── AgentDropdown.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── NotesPanel.tsx
│   │   │   ├── OptionsPanel.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ui
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── pages
│   ├── contexts
│   │   └── ChatContext.tsx
│   └── lib
│       ├── api.ts
│       ├── hooks
│       │   ├── use-copy-to-clipboard.tsx
│       │   ├── use-enter-submit.tsx
│       │   ├── use-local-storage.ts
│       │   ├── use-scroll-anchor.tsx
│       │   ├── use-sidebar.tsx
│       │   └── use-streamable-text.tsx
│       ├── types.ts
│       └── utils.ts
├── tailwind.config.ts
└── tsconfig.json
