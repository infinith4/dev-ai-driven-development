# Copilot Workspace Instructions

このファイルはGitHub Copilotがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

AI駆動開発プロジェクトです。GitHub Copilot、Codex、Claude Codeを使用して効率的なソフトウェア開発を行います。

## エージェント（プロンプト）

4つのエージェントプロンプトが利用可能です（`prompts/`ディレクトリ参照）:

| プロンプト | ファイル | 用途 |
|-----------|----------|------|
| 実装 | `prompts/implement.md` | 機能実装 |
| テスト | `prompts/tests.md` | 単体テスト作成 |
| E2E | `prompts/e2e.md` | E2Eテスト作成 |
| レビュー | `prompts/review.md` | コードレビュー |

## 基本ルール

- Honor repo standards: keep ASCII, concise comments only when non-obvious, prefer `rg` for search.
- Follow .agent/PLANS.md when drafting ExecPlans; keep changes idempotent.
- Be explicit about commands to run.
- Default to fast feedback: small diffs, clear rationale, note validation steps.
- For reviews, lead with risks/bugs/regressions and missing tests before summaries.
- Do not invent APIs; read existing files first.
- Prefer pure functions and predictable side effects.

## コマンド

### Backend (FastAPI/Python)
```bash
uvicorn backendapp.main:app --reload
python -m pytest
```

### Frontend (React/Vite)
```bash
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm test
```

### C# Backend/Batch
```bash
dotnet build
dotnet test csharp-backend.Tests/csharp-backend.Tests.csproj
dotnet test batch-csharp.Tests/Batch-csharp.Tests.csproj
```

### Java Backend
```bash
cd java-backend && mvn compile
cd java-backend && mvn test
```

## 主要ファイル

- `backendapp/main.py` - FastAPI バックエンド
- `frontend/src/App.tsx` - React フロントエンド
- `frontend/src/api.ts` - API クライアント
- `batch-csharp/*.cs` - C# バッチ処理
- `csharp-backend/` - C# Web API
- `java-backend/` - Java Spring Boot API

## 環境変数

- `VITE_API_BASE` - フロントエンドのAPI基点URL
- Batch CLI args - バッチ処理の引数

## セキュリティ

- 機密情報をコミットしない
- 入力値のバリデーションを行う
- OWASP Top 10を考慮する
