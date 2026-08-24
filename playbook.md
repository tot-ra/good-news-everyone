# Playbook

## Lessons

- Cursor Agent CLI cannot call A2gent tools such as `leonardo_generate_image` / `suggest_*` (MCP bridge not attached). Call Leonardo REST API directly using the enabled `leonardo` integration from `~/.local/share/aagent/aagent.db`, keep the API key out of repo files and chat replies.
- Journey stage previews live on `lifeJourney` in `src/main.js`; there is no preview field until we add one and render it in `.journey-stage`.
- Prefer `public/` for generated static preview images so Vite serves them as `/...` without bundling.
- Leonardo CDN downloads can return HTTP 403 without a browser-like `User-Agent`; retry with `User-Agent: Mozilla/5.0` and short backoff.
- Do not print Leonardo/integration secrets from sqlite into chat or repo files; load them into a chmod 600 temp env file for scripts only.
- Leonardo `preset_style` values are API-specific; when a human-readable style such as `Cinematic` returns 400, omit the preset and encode the visual direction in the prompt instead.
- If a configured review agent name is unavailable, continue with local inspection and tests; do not block the task on delegation.
- A2gent `suggest_*` / `question` / docker subagent tools are not available in Cursor Agent CLI; implement and verify locally, and put follow-ups / commit suggestions in the Russian reply text.
- Browser extension style inspection can time out on a busy tab; retry through the browser controller and verify computed styles after the page settles.
- Vague journey prompts like "solitary figure by a river" for Mark opening yield modern-looking mismatches; specify baptism of Jesus by John, first-century Judean dress, both figures fully clothed, reed Jordan banks, and omit `preset_style` when it 400s.
- Journey preview CSS uses `aspect-ratio: 4 / 3`; prefer Leonardo sizes near 1472x832 over square 1024 so `object-fit: cover` crops less awkwardly.
- When regenerating a rejected preview, keep several Leonardo candidates, visually pick one, then overwrite the canonical `public/journey-previews/*.jpg` and delete candidates.
- Sibling kurapov static sites (`kurapov.ee`, `dina.kurapov.ee`) serve nginx `root /www/<domain>/public` after publishing Vite/blog `dist/` to `public/` via `restart.sh`; keep `config/nginx.conf` in-repo and leave nginx reload + Certbot issuance as manual server steps.
- Do not gitignore all of `public/` when Vite static sources must ship: keep `public/journey-previews/**` tracked, add an nginx `location /journey-previews/` with `try_files $uri =404` (no SPA fallback), and verify the folder is non-empty in `restart.sh`. A missing preview otherwise returns `index.html` with `Content-Type: text/html`.
- Synodal gaps like `изИерусалима` / `истинапроизошли` break wiki/map link matching because aliases no longer tokenize; fix spaces in source JSON for the scene under review.
- BTI `Букв.` / `Друг. возм. пер.:` / `См. в Словаре` are truncated import artifacts glued to words; clean at display time in `formatBtiDisplayText` rather than inventing full footnote bodies across book JSON.
- Parallel A2gent sessions can rewrite the same gospel JSON concurrently; before keeping a huge BTI rewrite, diff against HEAD and restore unrelated corpora if the task only needed spacing/links.
- only.bible BTI HTML embeds footnote HTML (including literal `</span>`) inside `fn-tip` `title` attributes. Regex verse extractors that stop at the first `</span>` truncate russianBti and leave orphaned `Букв.:` markers. Parse tags with quote-aware attribute scanning, skip `fn-tip`, stop before `.footnotes`, and copy text to `vers-alt` targets.
- After fixing bible HTML import logic, re-run `node scripts/add-translation-variants.mjs` so both `src/data/books/*.json` and `library-index.json` stay in sync.
- Node checks that import `src/content.js` need a JSON import attribute because its static JSON import is normally handled by Vite; either import the JSON with `{ with: { type: "json" } }` in a standalone check or run the check through the Vite build.
- Chrome extension commands that call `location.reload()` can time out because reload tears down the command channel; treat the timeout as expected, list pages again, then verify the reconnected page.
- Browser automation is stateful and must be called as a top-level tool, never inside `parallel`; batch only filesystem/shell checks and run browser verification separately.
- Before delegating review to a generic agent name, discover configured agents first; an assumed `reviewer` ID may not exist.
- `code_execution` uses a restricted Python environment and may reject standard-library imports such as `pathlib`; for repository JSON transformations, prefer a small Node.js script via `bash`.
- When project file indexing is disabled, `content_search` fails even for simple literals; fall back immediately to targeted `grep` with narrow include/exclude patterns.
- If an external review agent times out after a missing local reviewer, do not retry indefinitely; proceed with local diff review, focused tests, build, and browser DOM verification.
- Wikidata entity JSON may return HTTP 403 to bare `urllib`; use a browser-like `User-Agent` or corroborate coordinates with search results instead.
- `browser_chrome.eval` does not accept bare top-level `await`; wrap asynchronous browser checks in an async IIFE such as `(async () => { ... })()`.

- Do not assume a standalone places JSON path; trace the actual export/import in `src/content.js` before scripting data checks.
- An external agent may be listed as online while delegation still fails because the local A2A tunnel is disconnected; treat discovery status as advisory and fall back to local review.
- Registry agents reported as online can still time out while contacting their upstream LLM; after one context-deadline failure, fall back to local diff review and browser verification instead of retrying.
