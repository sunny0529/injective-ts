import { GrpcException } from '@injectivelabs/exceptions'
import {
  PrepareTxRequest,
  PrepareTxResponse,
  BroadcastTxRequest,
  BroadcastTxResponse,
  CosmosTxFee,
  CosmosPubKey,
} from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { InjectiveExchangeRPC } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb_service'
import { ChainId, AccountAddress } from '@injectivelabs/ts-types'
import { recoverTypedSignaturePubKey } from '@injectivelabs/tx-utils'
import BaseConsumer from '../BaseConsumer'

export class TransactionConsumer extends BaseConsumer {
  async prepareTxRequest({
    address,
    chainId,
    message,
  }: {
    address: AccountAddress
    chainId: ChainId
    message: any
  }) {
    const gasLimit = 200000 // TODO
    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const prepareTxRequest = new PrepareTxRequest()
    prepareTxRequest.setChainId(chainId)
    prepareTxRequest.setSignerAddress(address)
    prepareTxRequest.setFee(cosmosTxFee)
    prepareTxRequest.addMsgs(Buffer.from(JSON.stringify(message), 'utf8'))

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async broadcastTxRequest({
    pubKeyType,
    signature,
    typedData,
    chainId,
    message,
  }: {
    pubKeyType: string
    signature: string
    typedData: string
    chainId: ChainId
    message: Record<string, any>
  }) {
    const parsedTypedData = JSON.parse(typedData)
    const publicKeyHex = recoverTypedSignaturePubKey(parsedTypedData, signature)
    parsedTypedData.message.msgs = null
    const txBytes = Buffer.from(JSON.stringify(parsedTypedData.message), 'utf8')
    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setMode('block')

    const cosmosPubKey = new CosmosPubKey()
    cosmosPubKey.setType(pubKeyType)
    cosmosPubKey.setKey(publicKeyHex)

    broadcastTxRequest.setChainId(chainId)
    broadcastTxRequest.setPubKey(cosmosPubKey)
    broadcastTxRequest.setSignature(signature)
    broadcastTxRequest.setTx(txBytes)
    broadcastTxRequest.setMsgsList([
      Buffer.from(JSON.stringify(message), 'utf8'),
    ])

    try {
      const response = await this.request<
        BroadcastTxRequest,
        BroadcastTxResponse,
        typeof InjectiveExchangeRPC.BroadcastTx
      >(broadcastTxRequest, InjectiveExchangeRPC.BroadcastTx)

      return response.toObject()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}