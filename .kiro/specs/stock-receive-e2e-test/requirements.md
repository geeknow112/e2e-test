# 要件定義書: 入庫予定日検索画面（stock-receive）E2Eテスト

## はじめに

WordPress管理画面内のTCSプラグイン「入庫予定日検索」画面（`admin.php?page=stock-receive`）に対するE2Eテスト仕様書です。

## 要件

### 要件1: 画面初期表示の検証

#### 受入条件

1. WHEN 入庫予定日検索画面にアクセスした場合、THE ページ SHALL 正常に表示されること
2. WHEN 画面が表示された場合、THE Search_Form SHALL 入庫日入力欄（`s[arrival_s_dt]`、`s[arrival_e_dt]`）、顧客名テキスト欄（`s[customer_name]`）、タンクテキスト欄（`s[tank]`）、商品名テキスト欄（`s[goods_name]`）、出庫倉庫セレクト（`s[outgoing_warehouse]`）、検索ボタンを表示すること

### 要件2: 検索機能の検証

#### 受入条件

1. WHEN 条件なしで検索した場合、THE ページ SHALL エラーなく表示すること
2. WHEN 入庫日を指定して検索した場合、THE ページ SHALL エラーなく表示すること
3. WHEN 顧客名テキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
4. WHEN タンクテキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
5. WHEN 商品名テキスト欄に文字列を入力して検索した場合、THE ページ SHALL エラーなく表示すること
6. WHEN 出庫倉庫を選択して検索した場合、THE ページ SHALL エラーなく表示すること
7. WHEN 全条件を同時に指定して検索した場合、THE ページ SHALL エラーなく表示すること
