V18 r253 — GitHub Pages generated from GAS canonical source

SOURCE POLICY
- gas-backend/ is the only editable application source.
- gas-backend/Index.html is the canonical host shell.
- github-pages/index.html is generated deployment output only.
- github-pages/assets/ is generated deployment output only.
- github-pages/github-config.js and github-pages/github-transport.js are host adapter/configuration, not duplicate application source.
- The source ZIP intentionally excludes generated index.html and generated assets.

PREPARE / INSTALL
From package root run:
  python tools/sync_github_assets.py

The command will:
1) remove stale github-pages/index.html and all stale files under github-pages/assets/;
2) render github-pages/index.html from gas-backend/Index.html, including the canonical inline templates/styles for all routes, with static-host substitutions only;
3) embed the canonical critical runtime from gas-backend/;
4) copy the approved shared frontend files from gas-backend/;
5) create CANONICAL_MIRROR_MANIFEST.json with r253 and SHA-256 hashes;
6) fail closed if canonical inputs or any of the 10 inline route templates do not match the expected contract.

VERIFY
  python tools/sync_github_assets.py --check

DEPLOY
- Deploy GAS from gas-backend/ as r253.
- Generate and verify GitHub output, then deploy github-pages/.
- GITHUB_PAGES_ORIGIN in Apps Script Properties must equal window.location.origin.
- GAS_WEB_APP_URL remains configured in github-config.js for the target /exec deployment.

Never hand-edit generated github-pages/index.html or github-pages/assets/. Change gas-backend/ and regenerate.

R253 LOGIN TRANSPORT HOTFIX
- Canonical backend always permits the exact production GitHub origin: https://sapa27.github.io
- GITHUB_PAGES_ORIGIN / GITHUB_PAGES_ORIGINS Script Properties remain additive for other explicitly trusted origins.
- No wildcard origin is used.
- Deploy gas-backend r253 to the SAME GAS Web App deployment first, then publish the generated github-pages output.
