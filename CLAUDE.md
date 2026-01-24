# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

AI駆動開発プロジェクトです。Claude CodeとCodexを使用して、効率的なソフトウェア開発を行います。

## 対応言語

- **TypeScript** - フロントエンド、Node.js バックエンド
- **Python** - データ処理、API、スクリプト
- **C#** - .NET アプリケーション
- **Java** - エンタープライズアプリケーション

## エージェント

このプロジェクトでは、`AGENTS.md`に定義された4つのエージェントを使用します：

1. **実装コーディングエージェント** - 機能実装
2. **単体テストコーディングエージェント** - 単体テスト作成
3. **E2Eテストコーディングエージェント** - E2Eテスト作成
4. **コーディングレビューエージェント** - コードレビュー

## コーディング規約

### 共通
- クリーンコードの原則に従う
- 適切なエラーハンドリングを実装
- セキュリティを考慮した実装

### TypeScript
- ESLint + Prettierを使用
- 厳格な型定義を使用
- async/awaitを優先

### Python
- PEP 8に準拠
- 型ヒントを使用
- Black + Ruffでフォーマット

### C#
- .NET コーディング規約に準拠
- nullableを有効化
- async/awaitパターンを使用

### Java
- Google Java Style Guideに準拠
- Lombokの適切な使用
- Stream APIの活用

## ディレクトリ構造

```
.
├── .claude/          # Claude Code設定
├── .codex/           # Codex設定
├── AGENTS.md         # エージェント定義
├── CLAUDE.md         # このファイル
├── src/              # ソースコード
├── tests/            # テストコード
└── docs/             # ドキュメント
```

## コマンド

### ビルド
```bash
# TypeScript
npm run build

# Python
pip install -e .

# C#
dotnet build

# Java
./gradlew build
```

### テスト
```bash
# TypeScript
npm test

# Python
pytest

# C#
dotnet test

# Java
./gradlew test
```

## 重要な注意事項

1. **セキュリティ**: 機密情報をコミットしない
2. **テスト**: 新機能には必ずテストを追加
3. **レビュー**: マージ前にコードレビューを実施
4. **ドキュメント**: APIの変更は必ずドキュメント化
