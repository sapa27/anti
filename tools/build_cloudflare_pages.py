from pathlib import Path
import argparse
import hashlib
import json
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
POLICY_PATH = ROOT / "CANONICAL_SOURCE_POLICY.json"


def _read(path):
    return path.read_text(encoding="utf-8")


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def sha256(path):
    return sha256_bytes(path.read_bytes())


def _compact_json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def load_policy():
    policy = json.loads(_read(POLICY_PATH))
    required = (
        "version", "canonicalEditableRoot", "generatedMirrorRoot", "sharedFrontendFiles",
        "canonicalHostShell", "generatedHostShell",
    )
    missing = [key for key in required if not policy.get(key)]
    if missing:
        raise RuntimeError("canonical policy missing: " + ", ".join(missing))
    if policy["canonicalEditableRoot"] != "gas-backend":
        raise RuntimeError("gas-backend must remain the single canonical editable root")
    if policy.get("packageIncludesGeneratedMirror") is not False:
        raise RuntimeError("source package must not include generated mirror")
    if policy.get("packageIncludesGeneratedHostShell") is not False:
        raise RuntimeError("source package must not include generated host shell")
    return policy


def _strip_js_comments(text):
    out = []
    i = 0
    state = "code"
    quote = ""
    esc = False
    while i < len(text):
        c = text[i]
        n = text[i + 1] if i + 1 < len(text) else ""
        if state == "code":
            if c in ('"', "'", "`"):
                state, quote, esc = "str", c, False
                out.append(c)
            elif c == "/" and n == "/":
                state = "line"
                i += 1
            elif c == "/" and n == "*":
                state = "block"
                i += 1
            else:
                out.append(c)
        elif state == "str":
            out.append(c)
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == quote:
                state = "code"
        elif state == "line":
            if c == "\n":
                out.append(c)
                state = "code"
        elif state == "block":
            if c == "*" and n == "/":
                state = "code"
                i += 1
        i += 1
    return "".join(out)


def _balanced_block(text, open_index, open_char="{", close_char="}"):
    if open_index < 0 or text[open_index] != open_char:
        raise ValueError("invalid balanced-block start")
    i = open_index
    depth = 0
    state = "code"
    quote = ""
    esc = False
    while i < len(text):
        c = text[i]
        n = text[i + 1] if i + 1 < len(text) else ""
        if state == "code":
            if c in ('"', "'", "`"):
                state, quote, esc = "str", c, False
            elif c == "/" and n == "/":
                state = "line"
                i += 1
            elif c == "/" and n == "*":
                state = "block"
                i += 1
            elif c == open_char:
                depth += 1
            elif c == close_char:
                depth -= 1
                if depth == 0:
                    return text[open_index:i + 1]
        elif state == "str":
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == quote:
                state = "code"
        elif state == "line":
            if c == "\n":
                state = "code"
        elif state == "block":
            if c == "*" and n == "/":
                state = "code"
                i += 1
        i += 1
    raise ValueError("unterminated balanced block")


def _function_return_object(path, function_name):
    text = _read(path)
    anchor = "function " + function_name + "("
    start = text.find(anchor)
    if start < 0:
        raise RuntimeError("function not found: " + function_name)
    ret = text.find("return", start)
    brace = text.find("{", ret)
    if ret < 0 or brace < 0:
        raise RuntimeError("return object not found: " + function_name)
    return _balanced_block(text, brace)


def _static_object(text, substitutions=None):
    value = _strip_js_comments(text)
    for old, new in (substitutions or []):
        if old not in value:
            raise RuntimeError("canonical object expression changed; missing token: " + old)
        value = value.replace(old, new)
    value = value.replace("!0", "true").replace("!1", "false")
    # Canonical configuration objects use double-quoted strings. Quote JavaScript identifier keys.
    value = re.sub(r'([\{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)', r'\1"\2"\3', value)
    try:
        return json.loads(value)
    except Exception as exc:
        raise RuntimeError("cannot parse canonical static object: " + str(exc))


def _release_metadata(src):
    text = _read(src / "Code_00_PlatformCore.gs")
    def field(name):
        m = re.search(r'\b' + re.escape(name) + r'\s*:\s*"([^"]+)"', text)
        if not m:
            raise RuntimeError("APP_DEPLOY_RELEASE field missing: " + name)
        return m.group(1)
    return {
        "stamp": field("stamp"),
        "buildName": field("buildName"),
        "assetStamp": field("assetStamp"),
        "sourceFingerprint": field("sourceFingerprint"),
        "contractStamp": field("contractStamp"),
    }


def _canonical_external_asset_policy(src):
    obj = _function_return_object(src / "Code_03_Platform_Assets.gs", "_appExternalAssetPolicy_")
    return _static_object(obj)


def _canonical_asset_manifest(src):
    release = _release_metadata(src)
    policy = _canonical_external_asset_policy(src)
    obj = _function_return_object(src / "Code_03_Platform_Assets.gs", "getAppAssetManifest_")
    return _static_object(obj, [
        ("_assetManifestStamp_()", _compact_json(release["assetStamp"])),
        ("_appExternalAssetPolicy_()", _compact_json(policy)),
    ])


def _canonical_permission_matrix(src):
    text = _read(src / "Code_02_Platform_Permissions.gs")
    anchor = "var APP_PERMISSION_MATRIX = _permissionDeepFreeze_("
    start = text.find(anchor)
    if start < 0:
        raise RuntimeError("APP_PERMISSION_MATRIX owner not found")
    brace = text.find("{", start + len(anchor))
    return _static_object(_balanced_block(text, brace))




def _validate_inline_route_templates(html):
    required = {
        "tpl-page-dashboard", "tpl-page-search", "tpl-page-report", "tpl-page-track",
        "tpl-page-meeting", "tpl-page-committee-meeting", "tpl-page-people",
        "tpl-page-petitioner", "tpl-page-budget", "tpl-page-admin",
    }
    found = set(re.findall(r'<script\b[^>]*\bid=["\']([^"\']+)["\'][^>]*\btype=["\']text/x-template["\']', html, re.I))
    found.update(re.findall(r'<script\b[^>]*\btype=["\']text/x-template["\'][^>]*\bid=["\']([^"\']+)["\']', html, re.I))
    missing = sorted(required - found)
    if missing:
        raise RuntimeError("canonical Index missing inline route templates: " + ", ".join(missing))
    return True


def _cloudflare_static_logo_url(config_path):
    # Static logo remains a public canonical asset; host config intentionally contains no GAS URL or secrets.
    return "https://upload.wikimedia.org/wikipedia/commons/9/9a/Seal_of_the_Parliament_of_Thailand.svg"


def _replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one canonical marker, found {count}")
    return text.replace(old, new, 1)


def _render_cloudflare_host_shell(policy, src):
    canonical = ROOT / policy["canonicalHostShell"]
    config_path = ROOT / "cloudflare" / "cloudflare-transport.js"
    critical_path = src / "Scripts_Critical_Login_Runtime.html"
    html = _read(canonical)
    _validate_inline_route_templates(html)
    version = str(policy["version"])
    release = _release_metadata(src)
    manifest = _canonical_asset_manifest(src)
    permission = _canonical_permission_matrix(src)
    logo_url = _cloudflare_static_logo_url(config_path)
    logo = {
        "svg": logo_url, "png96": logo_url, "png192": logo_url, "png512": logo_url,
        "inline": "", "active": logo_url, "source": "cloudflare-static-generated-from-gas",
    }
    bootstrap = {
        "ok": True,
        "authenticated": False,
        "page": "login",
        "requestedPage": "login",
        "session": None,
        "user": None,
        "source": "cloudflare-pages-generated-" + version,
        "hostMode": "cloudflare-pages",
        "appStamp": release["stamp"],
        "assetStamp": release["assetStamp"],
        "sourceFingerprint": release["sourceFingerprint"],
        "contractStamp": release["contractStamp"],
        "buildName": release["buildName"],
        "defaultRoute": "/dashboard",
        "sessionRestoreSupported": True,
        "permissionMatrix": permission,
        "permissionMatrixStamp": permission.get("stamp", ""),
    }

    html = _replace_once(
        html,
        "<?var __logo=(typeof getAppLogoConfig_==='function'&&getAppLogoConfig_())||{};?>\n",
        "",
        "logo-scriptlet",
    )
    html = _replace_once(html, '<?!= __logo.png96 ?>', logo_url, "preload-logo")
    html = _replace_once(html, "<?!=JSON.stringify(__logo||{})?>", _compact_json(logo), "logo-json")
    html = _replace_once(
        html,
        "<?!=JSON.stringify((typeof serverLogoUrl!=='undefined'&&serverLogoUrl)?serverLogoUrl:'')?>",
        _compact_json(logo_url),
        "server-logo-url",
    )
    html = html.replace("<?!= getActiveLogoUrl_() ?>", logo_url)
    html = html.replace("<?= getActiveLogoUrl_() ?>", logo_url)

    html = _replace_once(html, "<?!=bootstrapJson?>", _compact_json(bootstrap), "bootstrap-json")
    html = _replace_once(
        html,
        "<?!=(typeof assetManifestJson!=='undefined'&&assetManifestJson)?assetManifestJson:'{}'?>",
        _compact_json(manifest),
        "asset-manifest-json",
    )
    html = _replace_once(
        html,
        "<?!=(typeof permissionMatrixJson!=='undefined'&&permissionMatrixJson)?permissionMatrixJson:'{}'?>",
        _compact_json(permission),
        "permission-matrix-json",
    )

    critical = _read(critical_path).strip()
    critical_injection = (
        f'<script src="./cloudflare-transport.js?v={version}"></script>\n'
        + critical
    )
    html = _replace_once(
        html,
        "<?!=includeProductionBundle_('appCritical')?>",
        critical_injection,
        "critical-runtime",
    )

    core_files = manifest.get("bundles", {}).get("appCore", {}).get("files", [])
    html = _replace_once(
        html,
        "<?!=(typeof coreRuntimeFilesJson!=='undefined'&&coreRuntimeFilesJson)?coreRuntimeFilesJson:'[]'?>",
        _compact_json(core_files),
        "core-runtime-files",
    )
    html = _replace_once(
        html,
        "<?!=(typeof deferredScriptMapJson!=='undefined'&&\ndeferredScriptMapJson)?deferredScriptMapJson:'{}'?>",
        _compact_json(manifest.get("chunks", {})),
        "deferred-script-map",
    )
    if "<?" in html:
        snippets = [line.strip() for line in html.splitlines() if "<?" in line]
        raise RuntimeError("unresolved GAS template markers in generated Cloudflare index: " + " | ".join(snippets[:5]))
    marker = (
        "<!-- GENERATED DEPLOYMENT OUTPUT. EDIT gas-backend/Index.html AND CANONICAL GAS SOURCES ONLY. "
        + version + " -->\n"
    )
    html = html.replace('<html lang="th">\n', '<html lang="th">\n' + marker, 1)
    return html.rstrip() + "\n"


def validate_release_alignment(policy):
    version = str(policy["version"]).strip()
    checks = [
        (ROOT / "cloudflare" / "cloudflare-transport.js", r'LOCAL_ASSET_VERSION\s*:\s*["\']([^"\']+)', "Cloudflare LOCAL_ASSET_VERSION"),
        (ROOT / "gas-backend" / "Code_00_PlatformCore.gs", r'buildName\s*:\s*["\'][^"\']*\b(r\d+)\b', "GAS APP_DEPLOY_RELEASE buildName"),
        (ROOT / "gas-backend" / "Code_06_Platform_QualityGates.gs", r'current-quality-gate[^"\']*-(r\d+)', "GAS current quality gate"),
    ]
    errors = []
    for path, pattern, label in checks:
        if not path.is_file():
            errors.append(f"{label}: missing {path.relative_to(ROOT)}")
            continue
        match = re.search(pattern, _read(path), re.I)
        if not match:
            errors.append(f"{label}: version marker not found")
            continue
        actual = match.group(1)
        if actual.lower() != version.lower():
            errors.append(f"{label}: {actual} != {version}")
    if errors:
        raise RuntimeError("release alignment failed: " + "; ".join(errors))
    return version



def validate_cloudflare_transport_contract(policy):
    path = ROOT / "cloudflare" / "cloudflare-transport.js"
    text = _read(path)
    required = [
        'root.__APP_HOST_MODE__ = "cloudflare-pages"',
        'API_ENDPOINT',
        'function proxyRun(fn, args, options)',
        'credentials: "same-origin"',
        'cache: "no-store"',
        'root.AppTransport.mode = "cloudflare-pages-same-origin-proxy"',
    ]
    missing = [token for token in required if token not in text]
    if missing:
        raise RuntimeError("Cloudflare same-origin transport contract incomplete: " + ", ".join(missing))
    forbidden = ["postMessage(", "createElement(\"iframe\")", "GAS_BRIDGE", "GAS_POST_RESULT"]
    stale = [token for token in forbidden if token in text]
    if stale:
        raise RuntimeError("stale iframe/postMessage transport remains: " + ", ".join(stale))
    return True



def validate_no_stale_github_deployment():
    stale_paths = [
        ROOT / "index.html",
        ROOT / "github-config.js",
        ROOT / "github-transport.js",
        ROOT / "assets",
        ROOT / "github-pages",
    ]
    found = [str(path.relative_to(ROOT)) for path in stale_paths if path.exists()]
    if found:
        raise RuntimeError(
            "stale GitHub Pages deployment files remain; delete before Cloudflare build: " + ", ".join(found)
        )
    return True

def _source_and_dest(policy):
    return ROOT / policy["canonicalEditableRoot"], ROOT / policy["generatedMirrorRoot"]


def _expected_assets_manifest(policy, src, rendered_host):
    files = {}
    for name in policy["sharedFrontendFiles"]:
        source = src / name
        if not source.is_file():
            raise FileNotFoundError("missing canonical source: " + str(source.relative_to(ROOT)))
        files[name] = {"sha256": sha256(source), "bytes": source.stat().st_size}
    canonical_host = ROOT / policy["canonicalHostShell"]
    return {
        "version": policy["version"],
        "generated": True,
        "generatedFromCanonicalOnly": True,
        "canonicalRoot": policy["canonicalEditableRoot"],
        "generatedRoot": policy["generatedMirrorRoot"],
        "canonicalHostShell": policy["canonicalHostShell"],
        "canonicalHostShellSha256": sha256(canonical_host),
        "generatedHostShell": policy["generatedHostShell"],
        "generatedHostShellSha256": sha256_bytes(rendered_host),
        "files": files,
    }


def generate(policy):
    validate_release_alignment(policy)
    validate_cloudflare_transport_contract(policy)
    validate_no_stale_github_deployment()
    src, dst = _source_and_dest(policy)
    generated_host_path = ROOT / policy["generatedHostShell"]

    # Generated output is disposable. Always remove the entire dist directory before rendering.
    dist_root = generated_host_path.parent
    if dist_root.exists():
        shutil.rmtree(dist_root)
    dst.mkdir(parents=True, exist_ok=True)

    rendered_host = _render_cloudflare_host_shell(policy, src).encode("utf-8")
    for name in policy["sharedFrontendFiles"]:
        shutil.copy2(src / name, dst / name)
    generated_host_path.write_bytes(rendered_host)
    shutil.copy2(ROOT / "cloudflare" / "cloudflare-transport.js", dist_root / "cloudflare-transport.js")
    shutil.copy2(ROOT / "cloudflare" / "_headers", dist_root / "_headers")

    manifest = _expected_assets_manifest(policy, src, rendered_host)
    (dst / "CANONICAL_MIRROR_MANIFEST.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"prepared Cloudflare Pages deployment from gas-backend only: {len(manifest['files'])} assets + generated index ({policy['version']})")
    return 0


def check(policy):
    validate_release_alignment(policy)
    validate_cloudflare_transport_contract(policy)
    validate_no_stale_github_deployment()
    src, dst = _source_and_dest(policy)
    generated_host_path = ROOT / policy["generatedHostShell"]
    if not generated_host_path.is_file():
        print("ERROR: generated Cloudflare index is missing; run: python3 tools/build_cloudflare_pages.py", file=sys.stderr)
        return 2
    expected_host = _render_cloudflare_host_shell(policy, src).encode("utf-8")
    manifest_path = dst / "CANONICAL_MIRROR_MANIFEST.json"
    if not manifest_path.is_file():
        print("ERROR: generated assets are missing; run: python3 tools/build_cloudflare_pages.py", file=sys.stderr)
        return 2
    try:
        actual = json.loads(_read(manifest_path))
    except Exception as exc:
        print("ERROR: invalid generated manifest: " + str(exc), file=sys.stderr)
        return 2
    expected = _expected_assets_manifest(policy, src, expected_host)
    errors = []
    if generated_host_path.read_bytes() != expected_host:
        errors.append("generated dist/index.html differs from canonical render")
    if actual.get("version") != expected["version"]:
        errors.append(f"manifest version {actual.get('version')} != {expected['version']}")
    if actual.get("generatedHostShellSha256") != expected["generatedHostShellSha256"]:
        errors.append("generated host shell hash mismatch in manifest")
    allowed = set(policy["sharedFrontendFiles"]) | {"CANONICAL_MIRROR_MANIFEST.json"}
    existing = {p.name for p in dst.iterdir() if p.is_file()} if dst.exists() else set()
    extra = sorted(existing - allowed)
    missing = sorted(allowed - existing)
    if extra:
        errors.append("stale generated files: " + ", ".join(extra))
    if missing:
        errors.append("missing generated files: " + ", ".join(missing))
    for name, meta in expected["files"].items():
        generated = dst / name
        if generated.is_file() and (sha256(generated) != meta["sha256"] or generated.stat().st_size != meta["bytes"]):
            errors.append("mirror differs from gas-backend: " + name)
    dist_root = generated_host_path.parent
    for support_name in ("cloudflare-transport.js", "_headers"):
        expected_support = ROOT / "cloudflare" / support_name
        actual_support = dist_root / support_name
        if not actual_support.is_file():
            errors.append("missing Cloudflare build output: " + support_name)
        elif actual_support.read_bytes() != expected_support.read_bytes():
            errors.append("Cloudflare build output differs from source: " + support_name)
    if errors:
        for err in errors:
            print("ERROR: " + err, file=sys.stderr)
        return 1
    print(f"OK: Cloudflare Pages build exactly matches gas-backend canonical source ({len(expected['files'])} assets + index, {policy['version']})")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Build disposable Cloudflare Pages static output from the single gas-backend source for Git integration.")
    parser.add_argument("--check", action="store_true", help="verify generated deployment output without changing files")
    args = parser.parse_args()
    policy = load_policy()
    return check(policy) if args.check else generate(policy)


if __name__ == "__main__":
    raise SystemExit(main())
