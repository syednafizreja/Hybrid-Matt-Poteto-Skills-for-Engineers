# Feature Map (Agent Navigation & Runtime Verification Index)

Maps features, routes, keyboard shortcuts, CLI commands, and stable selectors directly to source paths for focused bug reproduction and verification.
>
> Auto-populated by `/hybrid-init` and kept current during `/hybrid-ship` and `/hybrid-retro`.

## Application Entry Points

- **Dev / Start Command:** `npm run dev` *(set by `/hybrid-init`)*
- **Health Check:** `http://localhost:3000/health` *(or CLI smoke command)*
- **Verification Driver:** Playwright / CDP / CLI runner

---

## Feature Registry

| Feature (Glossary Term) | User-Facing Route / Command | Exact Steps / Shortcuts to Reach | Stable Selectors / Flags | Source Directory | Runtime Verification Check |
| :--- | :--- | :--- | :--- | :--- | :--- |
| _Example: Auth Sign-In_ | _`/login`_ | _Open `/login` -> submit credentials_ | _`[data-testid="login-submit"]`_ | _`src/features/auth/`_ | _Redirects to `/dashboard` with no console errors_ |

---

## Performance & Reliability Budgets
- **UI Frame Budget (if Web/Desktop):** `< 16ms` per frame (60 FPS); zero blocking I/O on renderer thread.
- **API P95 Latency Budget:** `< 250ms` for standard reads.
- **Runtime Error Budget:** Zero uncaught exceptions or hydration mismatches.
