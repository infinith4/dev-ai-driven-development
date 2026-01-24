# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

AI駆動開発プロジェクトです。GitHub Copilot、Codex、Claude Codeを使用して、効率的なソフトウェア開発を行います。

## 対応言語

- **TypeScript** - フロントエンド（React）、Node.js バックエンド
- **Python** - FastAPI バックエンド、データ処理、スクリプト
- **C#** - .NET Web API、バッチ処理
- **Java** - Spring Boot エンタープライズアプリケーション

## エージェント

このプロジェクトでは、`AGENTS.md`に定義された9つのエージェントを使用します：

### 要件・設計フェーズ
1. **要件定義エージェント** - PRD、ユースケース、ユーザーストーリー
2. **画面仕様書エージェント** - UI/UX設計、ワイヤーフレーム
3. **基本設計書エージェント** - アーキテクチャ、インフラ設計
4. **詳細設計書エージェント** - クラス設計、DB設計、シーケンス図
5. **API仕様書エージェント** - OpenAPI仕様

### 実装・テストフェーズ
6. **実装コーディングエージェント** - 機能実装
7. **単体テストエージェント** - 単体テスト作成
8. **E2Eテストエージェント** - E2Eテスト作成

### レビューフェーズ
9. **コードレビューエージェント** - 品質・セキュリティレビュー

## スキルファイル

`.claude/skills/` ディレクトリに各エージェントの詳細スキルが定義されています：

```
.claude/skills/
├── requirements/       # 要件定義
├── ui-spec/           # 画面仕様書
├── basic-design/      # 基本設計書
├── detailed-design/   # 詳細設計書
├── api-spec/          # API仕様書
├── implementation/    # 実装
├── unit-test/         # 単体テスト
├── e2e-test/          # E2Eテスト
├── code-review/       # コードレビュー
└── codex-review/      # Codex連携レビュー
```

## 開発フロー

```
要件定義 → 設計（画面/基本/詳細/API） → 実装 → テスト → レビュー → マージ
```

## コーディング規約

### 共通
- クリーンコードの原則に従う
- 適切なエラーハンドリングを実装
- セキュリティを考慮した実装（OWASP Top 10）
- テスト可能な設計を心がける

### TypeScript
- ESLint + Prettierを使用
- 厳格な型定義（`strict: true`）
- async/awaitを優先
- 関数コンポーネントを使用（React）

### Python
- PEP 8に準拠
- 型ヒント（Type Hints）を使用
- Black + Ruffでフォーマット
- async/awaitパターンをサポート

### C#
- .NET コーディング規約に準拠
- Nullable参照型を有効化
- async/awaitパターンを使用
- DIコンテナを活用

### Java
- Google Java Style Guideに準拠
- Lombokの適切な使用
- Stream APIの活用
- Spring Bootのベストプラクティス

## ディレクトリ構造

```
.
├── .claude/              # Claude Code設定・スキル
├── .codex/               # Codex設定・エージェント
├── .copilot/             # GitHub Copilot設定・プロンプト
├── .vscode/              # VS Code設定
├── docs/                 # ドキュメント
│   ├── requirements/     # 要件定義書
│   ├── design/           # 設計書
│   ├── api/              # API仕様書
│   └── ui-specs/         # 画面仕様書
├── frontend/             # React/TypeScriptフロントエンド
├── backendapp/           # Python/FastAPIバックエンド
├── csharp-backend/       # C#/.NET Web API
├── batch-csharp/         # C#バッチ処理
├── java-backend/         # Java/Spring Bootバックエンド
├── tests/                # テストコード
├── AGENTS.md             # エージェント定義
└── CLAUDE.md             # このファイル
```

## コマンド

### フロントエンド (TypeScript/React)
```bash
cd frontend
npm install
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm test         # テスト実行
npm run lint     # リント
```

### バックエンド (Python/FastAPI)
```bash
pip install -r backendapp/requirements.txt
uvicorn backendapp.main:app --reload  # 開発サーバー
pytest tests/                          # テスト
ruff check .                           # リント
```

### C# Backend/Batch
```bash
dotnet build
dotnet run --project csharp-backend/
dotnet test csharp-backend.Tests/
dotnet test batch-csharp.Tests/
```

### Java Backend
```bash
cd java-backend
mvn compile
mvn spring-boot:run  # 開発サーバー
mvn test             # テスト
```

### E2Eテスト
```bash
npx playwright test
npx playwright test --ui  # インタラクティブモード
```

## ドキュメント作成

各エージェントが出力するドキュメントの配置先：

| ドキュメント種別 | 配置先 |
|----------------|--------|
| 要件定義書 | `docs/requirements/` |
| 基本設計書 | `docs/design/basic/` |
| 詳細設計書 | `docs/design/detailed/` |
| API仕様書 | `docs/api/` |
| 画面仕様書 | `docs/ui-specs/` |

## 重要な注意事項

1. **セキュリティ**: 機密情報（.env, credentials等）をコミットしない
2. **テスト**: 新機能には必ずテストを追加
3. **レビュー**: マージ前にコードレビューを実施（Codex連携可）
4. **ドキュメント**: APIの変更は必ずOpenAPI仕様を更新
5. **設計**: 実装前に適切な設計ドキュメントを作成

## Codex連携

重要な変更やマイルストーンでは、Codexレビュースキルを使用：

```
参照: .claude/skills/codex-review/SKILLS.md
```

- 規模判定（small/medium/large）に基づくレビュー
- `ok: true`になるまで反復修正
