# 登録画面（商品・顧客・注文）E2Eテスト仕様書

## 対象画面

| 画面名 | URL パラメータ | テストファイル |
|--------|---------------|---------------|
| 商品登録 | `page=goods-detail` | `tests/tcs/goods-detail.spec.ts` |
| 顧客登録 | `page=customer-detail` | `tests/tcs/customer-detail.spec.ts` |
| 注文登録 | `page=sales-detail` | `tests/tcs/sales-detail.spec.ts` |

## 共通仕様

- URL は `process.env.BASE_URL` + `/wp-admin/admin.php?page=xxx-detail` で構築
- 各テストで `assertPageLoaded()` により `#wpbody-content`、`#wpadminbar` の表示と Fatal error 不在を確認
- ブラウザは全画面表示 + CSS zoom 75%
- `WAIT_SEC` 環境変数（1〜3、デフォルト3）で待機秒数を制御

## 商品登録画面（goods-detail）— 3テスト

### テスト1: 画面初期表示・フォーム要素確認
- `#goods`（商品コード・readonly）、`#goods_name`、`#qty`、`#separately_fg`、`#remark`、`#cmd_regist` の存在確認

### テスト2: 編集可能欄への入力テスト
- `#goods` は readonly のためスキップ
- `#goods_name` に「テスト商品」、`#qty` に「10」、`#remark` に「テスト備考」を入力し値を検証

### テスト3: 確認ボタンクリック
- `#cmd_regist` をクリックし、Fatal error が発生しないこと、`#wpbody-content` が表示されることを確認

## 顧客登録画面（customer-detail）— 4テスト

### テスト1: 画面初期表示・フォーム要素確認
- `#customer`（顧客コード・readonly）、`#customer_name`、`#tank_0`、`#add_tank_0`、`input[name="goods_s[]"]`（商品チェックボックス群）、`#cmd_regist` の存在確認
- チェックボックスが1つ以上存在することを検証

### テスト2: 編集可能欄への入力テスト
- `#customer` は readonly のためスキップ
- `#customer_name` に「テスト顧客」、`#tank_0` に「テストタンク」を入力し値を検証

### テスト3: 商品チェックボックス操作
- 先頭のチェックボックスを check → checked 確認 → uncheck → not checked 確認

### テスト4: 追加ボタン・確認ボタンクリック
- `#add_tank_0`（追加ボタン）クリック → Fatal error なし確認
- `#cmd_regist`（確認ボタン）クリック → Fatal error なし、`#wpbody-content` 表示確認

## 注文登録画面（sales-detail）— 4テスト

### テスト1: 画面初期表示・フォーム要素確認
- 以下18要素の存在確認（visible または attached）:
  - `#sales`（注文番号・readonly）、`#customer`、`#class`、`#cars_tank`（hidden）、`select#goods`、`#ship_addr`、`#field1`、`select#qty`、`#use_stock`、`#delivery_dt`、`#arrival_dt`、`#outgoing_warehouse`、`#repeat_fg`、`#period`、`#span`、`#repeat_s_dt`、`#repeat_e_dt`、`#cmd_regist`

### テスト2: 編集可能欄への入力テスト
- `#field1` に「テスト備考」を入力し値を検証
- `#delivery_dt` に「2026-03-01」、`#arrival_dt` に「2026-03-02」を入力し値を検証
- `#customer` セレクトボックスで2番目のオプションを選択（選択肢が2つ以上ある場合）

### テスト3: チェックボックス操作（label 経由）
- `#use_stock` — `label.btn[for="use_stock"]` 経由でクリック → checked/unchecked を検証
- `#repeat_fg` — `label.btn[for="repeat_fg"]` が visible なら label 経由、なければ force クリックで操作

### テスト4: 確認ボタンクリック
- `#cmd_regist` をクリックし、Fatal error が発生しないこと、`#wpbody-content` が表示されることを確認

## 技術的な発見事項

- `goods`（商品コード）、`customer`（顧客コード）、`sales`（注文番号）の各コード入力欄は `readonly` 属性付き
- `#cars_tank` 等は `type="hidden"` のため `toBeAttached()` で確認（`toBeVisible()` は不可）
- 注文登録画面のチェックボックスは `label.btn` 経由でクリックする必要がある（直接クリック不可）
