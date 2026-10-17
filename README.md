# Atoll Audit

Free security checkup for apps built with AI coding tools (Lovable, Bolt, Cursor, Supabase, Firebase).

- `index.html`, `checker/`, `site.css`, `config.js`, `analytics.js`, `terms.html`, `privacy.html`: the website (served by GitHub Pages).
- `demo-app/`: a deliberately insecure test app with **fake** keys, used to try the scanner on a real URL.
- `mcp-server/`: the Python scanner, MCP server (tools `scan_app`, `check_code_for_leaks`, `get_fix_prompt`), local HTTP API and 97 tests. See `mcp-server/MCP.md` for Cursor, Claude Code and Windsurf setup.

Publishing steps are in `PUBLISH.md`.

Every key-like string in this repo is fake. Test fixtures build them from split pieces so secret scanners don't flag them.
