# Aggregate Tool

dHealth NetworkのDHPをアグリゲートトランザクションにて送信するツールです。 
Symbolでも使えます。
 
# Requirement
 
 以下の環境で動作を確認しています。

* Windows10 バージョン2004、ビルド18362以降
* Docker version 20.10.7, build f0df350
* docker-compose version 1.29.2, build 5becea4c
* Node.js v14.16.1 or v15.14.0
 
# Installation
 
*Dockerを使用する場合*

WindowsへDockerをインストールは下記の公式ページを参考に行ってください。

また、docker-composeのインストールも必要です。

環境構築後は下記のコマンドを実行してコンテナへ接続します。

```bash
docker-compose up -d
docker-compose exec node bash
```


*Dockerを使用しない場合*

windowsへのNode.jsのインストールは下記の公式ページを参考に行ってください。

https://docs.docker.jp/docker-for-windows/install.html

Node.jsのインストール後は "Usage" を参考してください。

https://nodejs.org/ja/

Qiita参考：https://qiita.com/echolimitless/items/83f8658cf855de04b9ce

# Usage
 
 
```bash
npm install
```

```bash
# .env.example を .env にリネーム
vm .env.example .env
```

```bash
# .address.js.example を address.js にリネーム
vm address.js.example address.js
```

Symbolネットワークを使う場合はノードリストを切り替え（aggregateTransaction.js 6行目）

```aggregateTransaction.js 6行目
const nodeList = require('./config.js');
```

変更後

```
const nodeList = require('./sym-config.js');
```

モザイク名の変更(aggregateTransaction.js 11行目)

送信したいモザイク名に変更


```aggregateTransaction.js 11行目
const mosaic_id = '39E0C49FA322A459'; //DHP

```

送信元のプライベートキーを設定

```bash
# private key を .env　に記述
CERTIFICATE_PRIVATE_KEY=***********************
```

```bash
# address.js 内の設定箇所を修正
// (※ここを追加する)
// ======================================
// 送信したいアドレス配列
// 送信したいアドレスを増やす場合はここを増やす
// 配列の3番目は送信したい数量（0か0.0にすると）
// aggregateTransaction.js 27行目 送信するモザイク量を優先する
// var mosaic_size = 0.1;
const ADDRESSES = [
  ["NAG47O**********", "message", 1.0],
  ["NAG47O**********", "", 0],
];

module.exports = ADDRESSES;
```

```bash
//送信するモザイク量
var mosaic_size = 1
//手数料(DHPの場合0でもイケる)
var fee_size = 0
var message = 'ここにメッセージを入れる'
// ======================================
```

```bash
#全ての設定が終わったら実行
node aggregateTransaction.js
```
 
# Note
 
免責事項

Aggregate Toolを使用したことにより発生したあらゆる損失や損害について、私は責任を負わないものとします。
 
 
# License
 
"Aggregate Tool" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
 