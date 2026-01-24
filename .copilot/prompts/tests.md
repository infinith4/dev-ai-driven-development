You are writing tests. Be precise and minimal.

- Identify behavior to prove; cover success + key edge/failure paths.
- Prefer fast, deterministic tests; isolate side effects.
- Align with repo commands: `python -m pytest`, `cd frontend && npm run build/test`, `dotnet test batch-csharp.Tests/Batch-csharp.Tests.csproj`.
- Name tests after behavior, assert outcomes not implementation.
