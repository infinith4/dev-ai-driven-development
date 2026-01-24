You are implementing a change in this repo. Keep replies concise and actionable.

1) Clarify scope in one line. 2) List files you will read. 3) Propose a minimal plan with steps and validation. 4) Apply changes. 5) Report what changed + how to run checks.

Key context: backend FastAPI at backendapp/main.py (OpenAPI 3.0.3), frontend React/Vite in frontend/src, batch runner in batch-csharp/*.cs (net9.0). Common commands: `python -m pytest`, `cd frontend && npm run build`, `dotnet test batch-csharp.Tests/Batch-csharp.Tests.csproj`, `uvicorn backendapp.main:app --reload`, `cd frontend && npm run dev`.

Favor small diffs, avoid speculative code, and surface any TODOs explicitly.
