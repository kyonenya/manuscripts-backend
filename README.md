## Clean Architecture

### Repository

- Repository層はその外側の層であるデータベースの詳細を知らない（DBの種類はpostgresで、接続クライアントにはnode-postgresを使う、等）。
  - Repository層はデータベース層は自分の機能をinterfaceとして抽象化して内側のRepository層に伝える（SQL文とパラメータを受け取るとクエリ結果を返す、等）。例えばデータベースの種類を変更したいときも、このinterfaceの設計に沿って外側だけを変更すればいいようにする。
- DB接続情報はRepositoryから直接参照せず、Controllerから依存性注入（DI）するのが良いとされている。本アプリではクラスを使わず、高階関数とカリー化によってDIと同じことを実現している。
  1. ControllerにてDB接続を注入（第1引数）
  2. UseCaseにてSQL文に埋め込むパラメータを代入すると実行される（第2引数）

### Entity

- ビジネスロジックの核心部。記事データのモデルを（getterやsetterを持たない）クラスで表現する。TypeScriptのクラスは型としても使えるのでこういう要所では使う。
- インスタンス化される際に、バリデーションやUUID生成などがコンストラクタで勝手に実行されるようにする。参考：[関心の分離を意識してサーバーを作ってみる(TypeScript + Express)](https://qiita.com/sadnessOjisan/items/ea5590efa3f55ef56edd)

### UseCase

- UseCase層は切らないことにした。後述するようにContorollerをメソッドチェーンで書けるようになり、モジュールに分割しなくてもロジックと副作用の分離が明らかであるため。
