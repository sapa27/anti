GitHub Pages deployment

1. Deploy the GAS backend package as Web App: Execute as deploying user, access Anyone.
2. In GAS Script Properties set GITHUB_PAGES_ORIGIN to the exact GitHub Pages origin, e.g. https://USERNAME.github.io
   For multiple origins use GITHUB_PAGES_ORIGINS separated by commas.
3. Put the GAS /exec URL in github-config.js.
4. Upload index.html, github-config.js, github-transport.js to the GitHub Pages repository root.

The frontend uses a postMessage iframe bridge; tokens are not placed in query strings and API routes remain unchanged.
