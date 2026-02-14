# 実装計画: 注文検索画面（sales-list）E2Eテスト

## 概要

既存の `tests/tcs/sales-list.spec.ts` をリファクタリングし、データ駆動アプローチによる保守性の高いE2Eテストに改善します。検索条件パターンを型付き配列で管理し、共通ヘルパー関数で検索実行ロジックを一元化します。

## タスク

- [x] 1. 型定義とロケーター定数の作成
  - [x] 1.1 `tests/tcs/sales-list.spec.ts` に `SearchCondition` インターフェースを定義する
    - `name`, `car_model?`, `status?`, `outgoing_warehouse?`, `delivery_s_dt?`, `delivery_e_dt?`, `arrival_s_dt?`, `arrival_e_dt?` フィールドを持つ型
    - _Requirements: 2.1〜2.7, 3.1〜3.3_
  - [x] 1.2 画面要素のロケーターを `LOCATORS` 定数オブジェクトとして定義する
    - 検索ボタン、各セレクトボックス、日付入力欄、詳細リンク、ページネーションリンクのセレクターを一元管理
    - _Requirements: 1.3, 1.4, 4.1, 5.1_
  - [x] 1.3 検索条件パターンを `SEARCH_PATTERNS` 配列として定義する
    - 10パターン: 条件なし、車種のみ、ステータス確定、ステータス未確定、倉庫のみ、配送日のみ、入庫日のみ、車種＋ステータス、倉庫＋配送日、全条件
    - _Requirements: 2.1〜2.7, 3.1〜3.3_

- [x] 2. 検索実行ヘルパー関数の作成
  - [x] 2.1 `executeSearch(page, condition)` 関数を実装する
    - ページ遷移 → `assertPageLoaded` → 条件設定（セレクト・日付） → `wait` → 検索ボタンクリック → `wait` → `assertPageLoaded` の一連の流れを実装
    - 各条件フィールドが存在する場合のみ設定する（`if`ガード）
    - `#wpbody-content`ロケーターには`.first()`を使用
    - _Requirements: 6.2, 6.3, 6.4_

- [x] 3. テストケースの実装
  - [x] 3.1 画面初期表示テストを実装する
    - 注文検索画面にアクセスし、`assertPageLoaded`で基本表示を確認
    - 検索ボタン、車種セレクト、ステータスセレクト、出庫倉庫セレクト、配送日入力欄×2、入庫日入力欄×2 の存在を`toBeVisible()`で検証
    - `LOCATORS`定数を使用してセレクターを参照
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 3.2 検索条件パターンテスト（データ駆動）を実装する
    - `test.setTimeout(300000)` でタイムアウトを5分に設定
    - `SEARCH_PATTERNS`配列を`for...of`ループで反復し、各パターンで`executeSearch`を呼び出す
    - 1つの`test`ブロック内で全パターンを連続実行（ブラウザを閉じない）
    - _Requirements: 2.1〜2.7, 3.1〜3.3, 6.5_
  - [x] 3.3 注文詳細リンク遷移テストを実装する
    - 注文検索画面にアクセスし、詳細リンク（`a[href*="page=sales-detail"]`）の存在を確認
    - リンクが存在する場合: クリック → `waitForURL(/page=sales-detail/)` → `assertPageLoaded`
    - リンクが存在しない場合: `test.skip(true, '注文詳細リンクが存在しない')`
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 3.4 ページネーションテストを実装する
    - 注文検索画面にアクセスし、2ページ目リンク（`a[href*="paged=2"]`）の存在を確認
    - リンクが存在する場合: クリック → `waitForURL(/paged=2/)` → `assertPageLoaded`
    - リンクが存在しない場合: `test.skip(true, 'ページネーションが存在しない')`
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. チェックポイント - 最終確認
  - `npx playwright test tests/tcs/sales-list.spec.ts --headed` でテストを実行し、全テストケースが正常に動作することを確認する
  - 各検索パターンで3秒待機が入り目視確認できることを確認する
  - Ensure all tests pass, ask the user if questions arise.

## 備考

- 既存の `lib/test-helpers.ts` は変更しません
- `tests/tcs/sales-list.spec.ts` を上書きリファクタリングします
- `LOCATORS`定数と`SearchCondition`型はテストファイル内にローカル定義します（他テストファイルとの共有は不要）
- 検索パターンの追加・変更は `SEARCH_PATTERNS` 配列の編集のみで対応可能です
