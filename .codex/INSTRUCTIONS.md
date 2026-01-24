# Codex Instructions

このファイルはCodex CLIがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

AI駆動開発プロジェクトです。GitHub Copilot、Codex、Claude Codeを使用して効率的なソフトウェア開発を行います。

## エージェント

4つのエージェントが利用可能です（詳細は`agents/`ディレクトリ参照）:

1. **implementation-agent**: 機能実装
2. **unit-test-agent**: 単体テスト作成
3. **e2e-test-agent**: E2Eテスト作成
4. **code-review-agent**: コードレビュー

## 対応言語

- TypeScript (frontend/, backendapp/)
- Python (backendapp/)
- C# (csharp-backend/, batch-csharp/)
- Java (java-backend/)

## コマンド

### TypeScript/Frontend
```bash
cd frontend && npm install
npm run dev      # 開発サーバー
npm run build    # ビルド
npm test         # テスト
```

### Python/Backend
```bash
pip install -r backendapp/requirements.txt
uvicorn backendapp.main:app --reload
pytest tests/
```

### C#
```bash
dotnet build
dotnet test csharp-backend.Tests/
dotnet test batch-csharp.Tests/
```

### Java
```bash
cd java-backend
mvn compile
mvn test
```

## ExecPlans

複雑な機能実装やリファクタリングでは、`.agent/PLANS.md`に従ってExecPlanを作成してください。

## セキュリティ

- 機密情報をコミットしない
- 入力値のバリデーションを行う
- OWASP Top 10を考慮する
