WAVES = [
    [
        {"name": "utils",      "path": "teamflow/src/utils"},
        {"name": "api",        "path": "teamflow/src/api"},
        {"name": "context",    "path": "teamflow/src/context"},
    ],
    [
        {"name": "hooks",      "path": "teamflow/src/hooks"},
        {"name": "components", "path": "teamflow/src/components"},
    ],
    [
        {"name": "pages",      "path": "teamflow/src/pages"},
        {"name": "app-entry",  "path": "teamflow/src", "target": "App.js and index.js only"},
    ],
    [
        {"name": "integration", "path": "teamflow", "integration": True}
    ]
]

PLAYBOOK_TITLE = "TeamFlow JS → TypeScript Migration"
PLAYBOOK_BODY = """\
## Procedure

1. Create a new branch named `ts-migrate/{module_name}` from `main`.
2. Navigate to the `teamflow/` directory — that's where the React app lives.
3. Find all `.js` and `.jsx` files in the directories specified in the session prompt.
4. For each file:
   a. Rename `.js` → `.ts` and `.jsx` → `.tsx`
   b. Read the code and add proper TypeScript interfaces/types for all props, state, return values, function parameters, and API response shapes.
   c. If the file uses PropTypes or defaultProps, replace with a TS interface + default parameter values.
   d. If the file uses `createContext()` with no default, type it as `createContext<T | null>(null)`.
   e. If functions are generic (e.g., utility helpers that work on any type), use generic type parameters.
5. Commit your changes and create a PR targeting `main`.

## Specifications

- Every migrated file must compile under `strict: true` (tsconfig.json is already configured).
- Zero `any` types unless absolutely unavoidable. If you must, add `// TODO: type this properly`.
- All React component props must have explicit interfaces (not inline types).
- All API response shapes must have named interfaces.
- CSS Module imports should be typed as `Record<string, string>`.

## Advice and Pointers

- The codebase has mixed styling: inline styles, plain CSS, CSS Modules, and Tailwind. Do NOT touch any CSS files.
- Some files use default exports, some named — keep the existing pattern.
- The API client has a response interceptor, make sure to Type accordingly.
- API calls exist but fallback gracefully, they are dummy API's. Keep this behavior, do not invent new API's.
- If a file imports from a module that hasn't been migrated yet, keep the original extension or let TS resolve it.

## Forbidden Actions

- Do NOT refactor, rename, or restructure any code — this is a pure type migration.
- Do NOT modify CSS/module.css files.
- Do NOT add new dependencies (@types/* packages are OK).
- Do NOT change any business logic or component behavior.
- Do NOT use `as any` type assertions to silence errors — fix the types instead.

## Tech Stack

React 18, React Router 6, Axios, Recharts, date-fns, clsx, prop-types (legacy), Tailwind CSS, CSS Modules, Vite
"""
