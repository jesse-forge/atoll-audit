# Publish Atoll Audit (about 15 minutes, $0)

## 1. Unzip
Unzip `atoll-audit-release.zip`. You get one folder with `index.html` at the top plus `checker/`, `demo-app/` and `mcp-server/`.

## 2. Create the repo
1. Sign in at https://github.com as **jesse-forge**.
2. Top right **+** > **New repository**.
3. Name: `atoll-audit`. Visibility: **Public** (free Pages needs public). Leave "Add a README" **unchecked**. Click **Create repository**.

## 3. Upload the files
1. On the new empty repo page click **uploading an existing file**.
2. Open the unzipped folder, select **everything inside it** (not the folder itself), and drag it into the browser. Folders keep their structure.
3. Hidden file check: `.nojekyll` starts with a dot, so Mac Finder hides it. If it isn't in the upload list, skip it now and do step 3.5.
4. Commit message: `First release`. Click **Commit changes**.
5. If `.nojekyll` was missed: **Add file** > **Create new file**, name it `.nojekyll`, leave it empty, **Commit changes**.

Upload limit: the web uploader takes up to 100 files at a time. This release is under that, so one drag works.

## 4. If GitHub blocks the upload because of a "secret"
Every key in this repo is fake, and the test files build their fake keys from split pieces, so GitHub's secret scanner shouldn't fire. If it still shows a "secret detected" box:
1. Read which file it names. It will be inside `mcp-server/tests`, `mcp-server/testtarget`, `mcp-server/reports` or `demo-app/assets`.
2. Choose **"It's used in tests"** (or "It's a false positive"), then **Allow secret**, and commit again. That's safe because none of the values are real.
3. Don't paste any real key into this repo, ever.

## 5. Turn on GitHub Pages
1. In the repo: **Settings** > **Pages** (left sidebar).
2. Source: **Deploy from a branch**. Branch: **main**, folder **/ (root)**. Click **Save**.
3. Wait 1 to 3 minutes and refresh. The page shows "Your site is live at ...".

## 6. Check it's live
- Website: https://jesse-forge.github.io/atoll-audit/
- Free key checker: https://jesse-forge.github.io/atoll-audit/checker/
- Demo app: https://jesse-forge.github.io/atoll-audit/demo-app/

## 7. Try the scanner on the demo app
On any computer with Python 3.9+ (nothing to install):
```
cd atoll-audit/mcp-server
python3 -m atoll_audit.cli https://jesse-forge.github.io/atoll-audit/demo-app/ --i-own-this-app
```
Expected: a service_role key exposed (critical), a secret-looking VITE_ variable (high), an exposed source map (medium), and missing security headers (low). The fake Supabase project doesn't exist, so there are no table or bucket results.

Run the tests: `cd mcp-server && python3 -m unittest discover -s tests` (should say `Ran 97 tests ... OK`; the key checker tests also need Node.js).

## 8. Connect the MCP server to an AI coding assistant
Follow `mcp-server/MCP.md`. Replace `/ABSOLUTE/PATH/TO/atoll-audit` with the full path of your `mcp-server` folder. Example for Claude Code:
```
claude mcp add atoll-audit -e PYTHONPATH=/full/path/to/atoll-audit/mcp-server -- python3 -m atoll_audit.mcp_server
```
The MCP server runs on your own machine. It is not hosted on the website.

## 9. Fill in the placeholders later (optional)
Edit `config.js` on GitHub (pencil icon) to add:
- `GOATCOUNTER_CODE`: your free GoatCounter site code (see `ANALYTICS.md`).
- `SCAN_REQUEST_URL`: your form endpoint for scan requests.
- `CONTACT_EMAIL`: the public contact address.

Until then the site works, analytics stay off, and the scan-request form says requests open soon and points visitors to the free key checker. Review `terms.html` and `privacy.html` (drafts) before promoting the site.

## Don't
- Don't add a custom domain or change other GitHub settings yet.
- Don't put real keys anywhere in this repo.
