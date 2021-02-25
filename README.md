manuscripts-backend

## これは何のアプリですか

[manuscripts-frontend](https://github.com/kyonenya/manuscripts-frontend)のバックエンドAPIサーバー。記事のCRUDとデーターベースとのやり取りを担当する。Herokuにデプロイしている。

### 使用技術

Node.js, express, Heroku Postgres

### データベース

- 無料で使えるRDBの最大手である Heroku Postgresを使用。記事データが現状3000件ほどで、1万行まで無料で使える。
- Node.js側の接続クライアントにはnode-postgresを使用。クエリビルダは使わず、生のSQL文を書いている（勉強のためというのもあるが、SQLというDB抽象をさらにORMで抽象化する必要性をあまり感じなかった）。

### 今後の予定

- Herokuをやめてvercelのサーバーレス関数に移行する

### Clean Architecture

[『Clean Architecture：達人に学ぶソフトウェアの構造と設計』](https://www.amazon.co.jp/dp/4048930656)を参考に設計。Javaならクラスで書くところを関数型的に書けないか試行錯誤した。以下メモ。

#### Repository

- Repository層はその外側の層であるデータベースの詳細を知らない（DBの種類はpostgresで、接続クライアントにはnode-postgresを使う、等）。
  - Repository層はデータベース層は自分の機能をinterfaceとして抽象化して内側のRepository層に伝える（SQL文とパラメータを受け取るとクエリ結果を返す、等）。例えばデータベースの種類を変更したいときも、このinterfaceの設計に沿って外側だけを変更すればいいようにする。
- DB接続情報はRepositoryから直接参照せず、Controllerから依存性注入（DI）するのが良いとされている。本アプリではクラスを使わず、高階関数によってDIと同じことを実現している。
  1. ControllerにてDB接続情報を注入（第1引数）
  2. UseCaseにてSQL文に埋め込むパラメータを代入すると実行される（第2引数）
  - 参考書籍：[『JavaScriptで学ぶ関数型プログラミング』](https://www.amazon.co.jp/dp/4873116600)

#### Entity

- ビジネスロジックの核心部。記事データのモデルを（getterやsetterを持たない）クラスで表現する。TypeScriptのクラスは型としても使えるのでこういう要所では使う。
- インスタンス化される際に、バリデーションやUUID生成などがコンストラクタで勝手に実行されるようにする。参考：[関心の分離を意識してサーバーを作ってみる(TypeScript + Express)](https://qiita.com/sadnessOjisan/items/ea5590efa3f55ef56edd)

#### UseCase

- UseCase層は切らないことにした。ContorollerをEitherモナドのメソッドチェーンで書けるようになり、モジュールに分割しなくてもロジックと副作用の分離が明らかであるため（注：あとでやる）。
  - 参考書籍：[『JavaScriptで学ぶ関数型プログラミング』](https://www.amazon.co.jp/dp/4295001139)
