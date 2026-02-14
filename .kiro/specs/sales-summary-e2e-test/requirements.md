# 要件定義書: 注文集計画面（sales-summary）E2Eテスト

## はじめに

WordPress管理画面内のTCSプラグイン「注文集計」画面（`admin.php?page=sales-summary`）に対するE2Eテスト仕様書です。

## 要件

### 要件1: 画面初期表示の検証

#### 受入条件

1. WHEN 注文集計画面にアクセスした場合、THE ページ SHALL 正常に表示されること
2. WHEN 画面が表示された場合、THE Search_Form SHALL 顧客名テキスト欄（`s[customer_name]`）、タンクテキスト欄（`s[tank]`）、商品名テキスト欄（`s[goods_name]`）、配送日入力欄（`s[delivery_s_dt]`、`s[delivery_e_dt]`）、出庫倉庫セレクト（`s[outgoing_warehouse]`）、検索ボタンを表示すること

### 要件2: 検索機能の検証

#### 受入条件

1. WHEN 条件なしで検索した場合、THE ページ SHALL エラーなく表示すること
2. WHEN 顧客名テキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
3. WHEN タンクテキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
4. WHEN 商品名テキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
5. WHEN 配送日を指定して検索した場合、THE ページ SHALL エラーなく表示すること
6. WHEN 出庫倉庫を選択して検索した場合、THE ページ SHALL エラーなく表示すること
7. WHEN 全条件を同時に指定して検索した場合、THE ページ SHALL エラーなく表示すること
