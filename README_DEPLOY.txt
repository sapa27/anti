V18 r257 — GitHub Pages / GAS canonical bridge-first deployment

SOURCE POLICY
- gas-backend/ is the only editable application source.
- gas-backend/Index.html is the canonical host shell.
- github-pages/index.html and github-pages/assets/ are generated deployment outputs only.
- github-pages/github-config.js and github-pages/github-transport.js are the only GitHub host adapter/config files.
- Do not hand-edit generated index.html or generated assets.

CANONICAL TRANSPORT
- Login/session and all remote data APIs use the same bridge-first path.
- Non-bootstrap API methods are routed through apiRouter as the single remote API entry.
- Persistent GAS Bridge uses google.script.run.
- Hidden POST + postMessage is fallback only when the bridge is unavailable before an API call is dispatched.
- A bridge request timeout after dispatch is never retried through POST, preventing duplicate writes/deletes.

AUTOMATIC GITHUB PAGES DEPLOYMENT
1) Deploy gas-backend/ to the existing GAS Web App deployment.
2) In Apps Script Project Settings > Script Properties set:
   GITHUB_PAGES_ORIGIN=https://sapa27.github.io
   Add other trusted exact origins with GITHUB_PAGES_ORIGINS only when actually used.
3) Ensure github-pages/github-config.js GAS_WEB_APP_URL is the same production /exec URL.
4) Push this repository to the main branch.
5) GitHub repository > Settings > Pages > Build and deployment > Source = GitHub Actions.
6) .github/workflows/pages.yml automatically runs:
   python tools/sync_github_assets.py
   python tools/sync_github_assets.py --check
   and deploys only ./github-pages as the Pages artifact.

LOCAL VERIFY
  python tools/sync_github_assets.py
  python tools/sync_github_assets.py --check

BROWSER QA
Open the GitHub Pages site and run:
  console.log(location.origin)
  console.log(window.APP_GITHUB_CONFIG)
  console.log(window.AppTransport && window.AppTransport.status())
Expected:
- apiTransportMode = bridge-first
- authTransportMode = bridge-first
- bridgeLoadState = ready after connection
- apiPostFallbackCalls normally remains 0
- postTimeouts normally remains 0

If bridgeLoadState = loaded-no-ready:
- verify GAS Web App is the latest r257 deployment;
- Execute as: Me;
- access permits the intended users / anonymous entry as required by the deployment;
- GITHUB_PAGES_ORIGIN exactly equals location.origin.
