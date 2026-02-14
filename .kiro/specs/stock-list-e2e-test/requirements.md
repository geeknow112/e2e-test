# 要件定義書: 在庫検索画面（stock-list）E2Eテスト

## はじめに

WordPress管理画面内のTCSプラグイン「在庫検索」画面（`admin.php?page=stock-list`）に対するE2Eテスト仕様書です。

## 用語集

- **在庫検索画面（Stock_List_Page）**: TCSプラグインの在庫一覧を検索・表示するWordPress管理画面ページ
- **検索フォーム（Search_Form）**: 在庫検索画面上部に配置された検索条件入力フォーム
- **assertPageLoaded**: ページが正常に読み込まれたことを検証する共通ヘルパー関数
- **wait**: 目視確認用に3秒待機する共通ヘルパー関数

## 要件

### 要件1: 画面初期表示の検証

**ユーザーストーリー:** テスト担当者として、在庫検索画面が正常に表示されることを確認したい。

#### 受入条件

1. WHEN テスト担当者が在庫検索画面のURLにアクセスした場合、THE Stock_List_Page SHALL WordPress管理バーとコンテンツ領域を表示すること
2. WHEN 在庫検索画面が表示された場合、THE Stock_List_Page SHALL Fatal errorおよびNot Foundのメッセージを含まないこと
3. WHEN 在庫検索画面が表示された場合、THE Search_Form SHALL 検索ボタン、商品番号テキスト欄（`s[no]`）、商品名テキスト欄（`s[goods_name]`）、数量テキスト欄（`s[qty]`）、ロットテキスト欄（`s[lot]`）、出庫倉庫セレクト（`s[outgoing_warehouse]`）、入庫日入力欄（`s[arrival_s_dt]`、`s[arrival_e_dt]`）を表示すること

### 要件2: 検索機能の検証

**ユーザーストーリー:** テスト担当者として、各検索条件で検索が正常に実行されることを確認したい。

#### 受入条件

1. WHEN 検索条件を何も指定せずに検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
2. WHEN 商品番号テキスト欄に文字列を入力して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
3. WHEN 商品名テキスト欄に文字列を入力して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
4. WHEN 数量テキスト欄に文字列を入力して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
5. WHEN ロットテキスト欄に文字列を入力して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
6. WHEN 出庫倉庫セレクトを選択して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
7. WHEN 入庫日の開始日と終了日を指定して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること
8. WHEN 全条件を同時に指定して検索した場合、THE Stock_List_Page SHALL エラーなく検索結果を表示すること

### 要件3: リスト内リンク遷移の検証

**ユーザーストーリー:** テスト担当者として、検索結果のリンクから各詳細画面へ正常に遷移できることを確認したい。

#### 受入条件

1. WHEN リスト内の在庫詳細リンク（`page=stock-detail`）をクリックした場合、THE Stock_List_Page SHALL 在庫詳細画面へ遷移すること
2. WHEN リスト内の在庫一括リンク（`page=stock-bulk`）をクリックした場合、THE Stock_List_Page SHALL 在庫一括画面へ遷移すること
3. WHEN リスト内のロット登録リンク（`page=stock-lot-regist`）をクリックした場合、THE Stock_List_Page SHALL ロット登録画面へ遷移すること

### 要件4: ページネーション機能の検証

#### 受入条件

1. WHEN ページネーションの2ページ目リンクをクリックした場合、THE Stock_List_Page SHALL 2ページ目へ遷移すること
2. IF ページネーションリンクが存在しない場合、THEN THE テスト SHALL スキップされること
