// 設定の読み込み & 変数宣言
// ======================================
require('dotenv').config()

const axios = require('axios').default
const nodeList = require('./config.js')
const symbol_sdk_1 = require('symbol-sdk')

const network_type = symbol_sdk_1.NetworkType.MAIN_NET
const private_key = process.env.CERTIFICATE_PRIVATE_KEY
const mosaic_id = '39E0C49FA322A459'; //DHP
const networkGenerationHash = 'ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16'  //DHP
const networkCurrencyDivisibility = 6
const explorer = 'http://explorer.dhealth.cloud'
var epochAdjustment
// ======================================

// (※ここを追加する)
// ======================================
// 送信したいアドレス配列
// 送信したいアドレスを増やす場合はここを増やす
var address_list = [
  'NDBSQQ*******************',
  'NB4REC*******************',
]
//送信するモザイク量
var mosaic_size = 1
//手数料(DHPの場合0でもイケる)
var fee_size = 0
var message = 'ここにメッセージを入れる'
// ======================================

// 生きているノードの取得
async function connectNode(){
  const nodes = nodeList

  const node = nodes[Math.floor(Math.random() * nodes.length)]
  const url =  node + "/node/health"
  try{
    return await axios.get(url,{timeout: 1500})
    .then(function(response) {
      if(response.data.status.apiNode == "up" && response.data.status.db == "up"){
        return node
      }
      return connectNode()
    })
  } catch (error){
    console.log('error', error)
    return connectNode()
  }
}

// ユーザからのキーボード入力を取得する Promise を生成する
function readUserInput(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}

(async() => {
  console.log('=== start ===')

  //ノードの取得
  const node = await connectNode()
  console.log('選択されたノード',node)

  //リポジトリファクトリの生成
  const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(node)
  //epochAdjustmentの取得
  epochAdjustment = await repositoryFactory.getEpochAdjustment().toPromise()

  //送信アカウントをプライベートキーから生成
  const senderAccount = symbol_sdk_1.Account.createFromPrivateKey(private_key, network_type)
  // replace with mosaic_id
  const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId(mosaic_id)
  
  //送信するモザイク量
  const mosaicSize = mosaic_size * Math.pow(10, networkCurrencyDivisibility)
  console.log("送信するmosaic量", mosaic_size)

  if(mosaic_size >= 100){
    const ans = await readUserInput('送信するmosaic量が ' + mosaic_size + " です。ほんとに送信しますか？[yes/N] ");
    if(ans != 'yes'){
      console.log('送信を中止しました。');
      process.exit()
    }
  }

  //送信先アドレス配列
  let sendAddressList = [];
  //送信先トランザクションを生成
  address_list.forEach(list => {
    console.log("送信アドレス", list)
    const mosaic = new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(mosaicSize))
    
    //アグリゲートトランザクションを送信するアドレスを生成
    const address = symbol_sdk_1.Address.createFromRawAddress(list)
    const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(epochAdjustment),
      address, [mosaic], symbol_sdk_1.PlainMessage.create(message), network_type)
    const aggregatedTransfar = transferTransaction.toAggregate(senderAccount.publicAccount)

    //配列に保持
    sendAddressList.push(aggregatedTransfar);
  })

  //送信リストが空でなければ実行
  if(sendAddressList.length != 0){
    //アグリゲートトランザクションに署名
    const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createComplete(symbol_sdk_1.Deadline.create(epochAdjustment),
      sendAddressList,
      network_type, [], symbol_sdk_1.UInt64.fromUint(fee_size))

    //アグリゲートトランザクションをアナウンス
    const signedTransaction = senderAccount.sign(aggregateTransaction, networkGenerationHash)
    // replace with node endpoint
    const transactionHttp = repositoryFactory.createTransactionRepository()
    transactionHttp.announce(signedTransaction).subscribe((x) => {
      console.log("success",x)
      console.log("トランザクション詳細", explorer + "/transactions/" + signedTransaction.hash)
    }, (err) => console.error("error",err))
  }
})()