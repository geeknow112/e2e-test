# 要件定義書: 在庫出力日別画面（stock-export-day）E2Eテスト

## はじめに

WordPress管理画面内のTCSプラグイン「在庫出力日別」画面（`admin.php?page=stock-export-day`）に対するE2Eテスト仕様書です。

## 要件

### 要件1: 画面初期表示の検証

#### 受入条件

1. WHEN 在庫出力日別画面にアクセスした場合、THE ページ SHALL 正常に表示されること
2. WHEN 画面が表示された場合、THE Search_Form SHALL 配送日入力欄（`s[delivery_s_dt]`）、出庫倉庫セレクト（`s[outgoing_warehouse]`）、検索ボタンを表示すること

### 要件2: 検索機能の検証

#### 受入条件

1. WHEN 条件なしで検索した場合、THE ページ SHALL エラーなく表示すること
2. WHEN 配送日を指定して検索した場合、THE ページ SHALL エラーなく表示すること
3. WHEN 出庫倉庫を選択して検索した場合、THE ページ SHALL エラーなく表示すること
4. WHEN 全条件を同時に指定して検索した場合、THE ページ SHALL エラーなく表示すること
