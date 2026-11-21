# Feature Map (Agent Navigation & Runtime Verification Index)

> Maps user-facing features, UI routes, keyboard shortcuts, CLI commands, and stable DOM selectors directly to source directories so agents never flail or guess during bug reproduction and verification.
>
> Auto-populated by `/hybrid-init` and kept current during `/hybrid-ship` and `/hybrid-retro`.

## Application Entry Points

- **Start / Dev Command:** `npm run dev` *(updated by `/hybrid-init`)*
- **Health Check URL / Command:** `http://localhost:3000/health` *(or CLI smoke command)*
- **Verification Driver:** Playwright / Chrome DevTools Protocol (CDP) / CLI runner

---

## Feature Registry

| Feature (Glossary Term) | User-Facing Route / Command | Exact Steps / Shortcuts to Reach | Stable Selectors / Flags | Source Directory | Runtime Verification Check |
| :--- | :--- | :--- | :--- | :--- | :--- |
| _Example: Auth Sign-In_ | _`/login`_ | _Navigate `/login` -> fill email/password -> submit_ | _`[data-testid="login-email"]`, `[data-testid="login-submit"]`_ | _`src/features/auth/`_ | _Redirects to `/dashboard` with valid session_ |

---

## Performance & Reliability Budgets
- **UI Frame Budget (if Web/Desktop):** `< 16ms` per frame (60 FPS); zero blocking I/O on renderer thread.
- **API P95 Latency Budget:** `< 250ms` for standard reads.
- **Runtime Error Budget:** Zero uncaught exceptions, unhandled promise rejections, or hydration warnings.
