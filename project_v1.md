# AI 駆動開発

AI 駆動開発を行いたいです。

以下のSpecです。
- Claude Code 
- Codex

以下の言語での開発を行います。
- Typescript
- Python
- C#
- Java

以下のフォルダやファイルを構成してください。
.claude
.codex

AGENTS.md
CLAUDE.md

以下のエージェントを作成してください。
- 実装コーディングエージェント
- 単体テストコーディングエージェント
- E2Eテストコーディングエージェント
- コーディングレビューエージェント

## エージェント実装方法の案

### 案1: AGENTS.md（ドキュメント定義）

- マークダウンファイルでエージェントの役割・責務を定義
- Claude Codeが参照してコンテキストとして使用
- シンプルで導入しやすい

### 案2: Custom Slash Commands (Skills)

- `.claude/commands/` フォルダにmarkdownファイルを作成
- 例: `/implement`, `/unit-test`, `/e2e-test`, `/review`
- 各エージェントを個別のコマンドとして呼び出し可能

### 案3: Claude Code Hooks

- `.claude/settings.json` でフックを設定
- 特定のイベント（コミット前、プッシュ前など）でエージェントを自動実行
- CI/CD的な自動化が可能

### 案4: MCP (Model Context Protocol) Servers

- 外部ツールやAPIとの連携
- より高度なエージェント機能を実現
- カスタムツールの追加が可能

### 案5: Codex agents

- `.codex/agents/` フォルダにエージェント設定を配置
- Codex固有の設定形式で定義
- OpenAI Codexとの連携
