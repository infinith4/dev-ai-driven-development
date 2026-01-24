# Copilot Workspace Instructions

- Honor repo standards: keep ASCII, concise comments only when non-obvious, prefer `rg` for search. Follow .agent/PLANS.md when drafting ExecPlans; keep changes idempotent.
- Be explicit about commands to run: backend `uvicorn backendapp.main:app --reload`, frontend `cd frontend && npm run dev`, tests `python -m pytest`, `npm run build`, `dotnet test batch-csharp.Tests/Batch-csharp.Tests.csproj`.
- Default to fast feedback: small diffs, clear rationale, note validation steps; list natural next steps.
- For reviews, lead with risks/bugs/regressions and missing tests before summaries.
- Do not invent APIs; read existing files first: backendapp/main.py, frontend/src/App.tsx, batch-csharp/*.cs, .agent/*.md (execplans).
- Prefer pure functions and predictable side effects; surface config via env/flags (e.g., `VITE_API_BASE`, batch CLI args).
