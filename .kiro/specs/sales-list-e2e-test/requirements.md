# 要件定義書: 注文検索画面（sales-list）E2Eテスト

## はじめに

WordPress管理画面内のTCSプラグイン「注文検索」画面（`admin.php?page=sales-list`）に対するE2Eテスト仕様書です。Playwright + TypeScriptを使用し、画面の検索機能・画面遷移・ページネーションが正常に動作することを検証します。既存の10パターン検索テストの構造を改善し、保守性と可読性を向上させることを目的とします。

## 用語集

- **注文検索画面（Sales_List_Page）**: TCSプラグインの注文一覧を検索・表示するWordPress管理画面ページ
- **検索フォーム（Search_Form）**: 注文検索画面上部に配置された、検索条件を入力するフォーム領域。テキスト入力欄（注文番号、顧客名、商品名、配送先、ロット）とセレクトボックス（車種、ステータス、出庫倉庫）と日付入力欄（配送日、入庫日）で構成される
- **検索結果テーブル（Results_Table）**: 検索フォームの下部に表示される、検索条件に合致した注文一覧のテーブル
- **ページネーション（Pagination）**: 検索結果が複数ページにわたる場合に表示されるページ切り替えリンク
- **注文詳細画面（Sales_Detail_Page）**: 個別の注文情報を表示・編集する画面（`admin.php?page=sales-detail`）
- **assertPageLoaded**: ページが正常に読み込まれたことを検証する共通ヘルパー関数（Fatal errorやNot Foundが無いことを確認）
- **wait**: 目視確認用に指定ミリ秒待機する共通ヘルパー関数（デフォルト3000ms）

## 要件

### 要件1: 画面初期表示の検証

**ユーザーストーリー:** テスト担当者として、注文検索画面が正常に表示されることを確認したい。画面の基本要素が揃っていることを検証するためです。

#### 受入条件

1. WHEN テスト担当者が注文検索画面のURLにアクセスした場合、THE Sales_List_Page SHALL WordPress管理バー（`#wpadminbar`）とコンテンツ領域（`#wpbody-content`）を表示すること
2. WHEN 注文検索画面が表示された場合、THE Sales_List_Page SHALL Fatal errorおよびNot Foundのメッセージを含まないこと
3. WHEN 注文検索画面が表示された場合、THE Search_Form SHALL 検索ボタン（`input[value="検索"]`）を表示すること
4. WHEN 注文検索画面が表示された場合、THE Search_Form SHALL 注文番号テキスト欄（`s[no]`）、顧客名テキスト欄（`s[customer_name]`）、商品名テキスト欄（`s[goods_name]`）、配送先テキスト欄（`s[ship_addr]`）、ロットテキスト欄（`s[lot]`）、車種セレクト（`s[car_model]`）、ステータスセレクト（`s[status]`）、出庫倉庫セレクト（`s[outgoing_warehouse]`）、配送日入力欄（`s[delivery_s_dt]`、`s[delivery_e_dt]`）、入庫日入力欄（`s[arrival_s_dt]`、`s[arrival_e_dt]`）を表示すること

### 要件2: 単一条件での検索機能の検証

**ユーザーストーリー:** テスト担当者として、各検索条件を単独で指定した場合に検索が正常に実行されることを確認したい。各フィールドが独立して機能することを検証するためです。

#### 受入条件

1. WHEN 検索条件を何も指定せずに検索ボタンをクリックした場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
2. WHEN 車種セレクトで「6t-1」（value=2）を選択して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
3. WHEN ステータスセレクトで「確定」（value=1）を選択して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
4. WHEN ステータスセレクトで「未確定」（value=0）を選択して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
5. WHEN 出庫倉庫セレクトで「内藤SP」（value=1）を選択して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
6. WHEN 配送日の開始日と終了日を指定して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
7. WHEN 入庫日の開始日と終了日を指定して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
8. WHEN 注文番号テキスト欄に任意の文字列を入力して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
9. WHEN 顧客名テキスト欄に任意の文字列を入力して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
10. WHEN 商品名テキスト欄に任意の文字列を入力して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
11. WHEN 配送先テキスト欄に任意の文字列を入力して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
12. WHEN ロットテキスト欄に任意の文字列を入力して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること

### 要件3: 複合条件での検索機能の検証

**ユーザーストーリー:** テスト担当者として、複数の検索条件を組み合わせた場合に検索が正常に実行されることを確認したい。条件の組み合わせによる不具合がないことを検証するためです。

#### 受入条件

1. WHEN 車種とステータスを同時に指定して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
2. WHEN 出庫倉庫と配送日を同時に指定して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
3. WHEN 全ての検索条件（車種、ステータス、出庫倉庫、配送日、入庫日）を同時に指定して検索した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること

### 要件4: 注文詳細画面への遷移の検証

**ユーザーストーリー:** テスト担当者として、検索結果から注文詳細画面へ正常に遷移できることを確認したい。画面間のリンクが正しく機能することを検証するためです。

#### 受入条件

1. WHEN 検索結果テーブル内の注文詳細リンク（`a[href*="page=sales-detail"]`）をクリックした場合、THE Sales_List_Page SHALL 注文詳細画面（`page=sales-detail`を含むURL）へ遷移すること
2. WHEN 注文詳細画面へ遷移した場合、THE Sales_Detail_Page SHALL エラーなく正常に表示されること
3. IF 検索結果に注文詳細リンクが存在しない場合、THEN THE テスト SHALL スキップされ、リンクが存在しない旨を報告すること

### 要件5: ページネーション機能の検証

**ユーザーストーリー:** テスト担当者として、検索結果のページネーションが正常に動作することを確認したい。複数ページにわたる結果を正しく閲覧できることを検証するためです。

#### 受入条件

1. WHEN ページネーションの2ページ目リンク（`a[href*="paged=2"]`）をクリックした場合、THE Sales_List_Page SHALL 2ページ目（URLに`paged=2`を含む）へ遷移すること
2. WHEN 2ページ目へ遷移した場合、THE Sales_List_Page SHALL エラーなく検索結果を表示すること
3. IF ページネーションリンクが存在しない場合、THEN THE テスト SHALL スキップされ、ページネーションが存在しない旨を報告すること

### 要件6: テスト実行環境と共通制約

**ユーザーストーリー:** テスト担当者として、テストが安定して実行される環境を維持したい。目視確認と自動検証を両立するためです。

#### 受入条件

1. THE テスト SHALL `auth.json`による認証状態を使用してWordPress管理画面にアクセスすること
2. THE テスト SHALL 各アクション後に`wait(page)`ヘルパーを使用して3秒間待機し、目視確認を可能にすること
3. THE テスト SHALL `assertPageLoaded(page)`ヘルパーを使用してページの正常表示を検証すること
4. THE テスト SHALL `#wpbody-content`ロケーターに`.first()`を付与して重複要素の問題を回避すること
5. WHILE 検索条件テストを実行中、THE テスト SHALL 1つのブラウザインスタンス内で全パターンを連続実行すること（テストごとにブラウザを閉じない）
6. THE テスト SHALL `process.env.BASE_URL`からベースURLを構築し、ハードコードされたURLを使用しないこと
7. THE テスト SHALL headedモードでブラウザを75%表示（deviceScaleFactor: 0.75相当）で起動し、画面全体を目視確認しやすくすること
