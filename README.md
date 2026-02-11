# E2E Tests

WordPress管理画面（TCSプラグイン）のPlaywright E2Eテスト

## セットアップ

```bash
npm install
npx playwright install
cp .env.example .env  # 編集して実際の値を設定
```

## 認証

手動ログインで認証情報を保存:

```bash
npm run auth:manual
```

## テスト実行

```bash
npm run test:only            # ヘッドレス実行
npm run test:only -- --headed  # ブラウザ表示あり
```

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run auth` | 自動ログイン + auth.json 保存 |
| `npm run auth:manual` | 手動ログイン + auth.json 保存 |
| `npm run test` | setup + テスト実行 |
| `npm run test:only` | テストのみ実行（auth.json 必要） |
| `npm run test:headed` | ブラウザ表示ありで実行 |
| `npm run test:ui` | Playwright UI モード |
