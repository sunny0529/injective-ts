import {
  GetTxByTxHashRequest,
  GetTxByTxHashResponse,
  GetAccountTxsRequest,
  GetAccountTxsResponse,
  GetValidatorRequest,
  GetValidatorResponse,
  GetValidatorUptimeRequest,
  GetValidatorUptimeResponse,
  GetPeggyDepositTxsRequest,
  GetPeggyDepositTxsResponse,
  GetPeggyWithdrawalTxsRequest,
  GetPeggyWithdrawalTxsResponse,
  GetIBCTransferTxsRequest,
  GetIBCTransferTxsResponse,
  GetBlockRequest,
  GetBlockResponse,
  GetBlocksRequest,
  GetBlocksResponse,
  GetTxsRequest,
  GetTxsResponse,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'
import { InjectiveExplorerRPC } from '@injectivelabs/indexer-api/injective_explorer_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcExplorerTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcExplorerApi extends BaseConsumer {
  protected module: string = IndexerModule.Explorer

  async fetchTxByHash(hash: string) {
    const request = new GetTxByTxHashRequest()
    request.setHash(hash)

    try {
      const response = await this.request<
        GetTxByTxHashRequest,
        GetTxByTxHashResponse,
        typeof InjectiveExplorerRPC.GetTxByTxHash
      >(request, InjectiveExplorerRPC.GetTxByTxHash)

      return IndexerGrpcExplorerTransformer.getTxByTxHashResponseToTx(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchAccountTx({
    address,
    limit,
    type,
  }: {
    address: string
    limit?: number
    type?: string
  }) {
    const request = new GetAccountTxsRequest()
    request.setAddress(address)

    if (limit) {
      request.setLimit(limit)
    }

    if (type) {
      request.setType(type)
    }

    try {
      const response = await this.request<
        GetAccountTxsRequest,
        GetAccountTxsResponse,
        typeof InjectiveExplorerRPC.GetAccountTxs
      >(request, InjectiveExplorerRPC.GetAccountTxs)

      return IndexerGrpcExplorerTransformer.getAccountTxsResponseToAccountTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidator(validatorAddress: string) {
    const request = new GetValidatorRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorRequest,
        GetValidatorResponse,
        typeof InjectiveExplorerRPC.GetValidator
      >(request, InjectiveExplorerRPC.GetValidator)

      return IndexerGrpcExplorerTransformer.validatorResponseToValidator(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchValidatorUptime(validatorAddress: string) {
    const request = new GetValidatorUptimeRequest()
    request.setAddress(validatorAddress)

    try {
      const response = await this.request<
        GetValidatorUptimeRequest,
        GetValidatorUptimeResponse,
        typeof InjectiveExplorerRPC.GetValidatorUptime
      >(request, InjectiveExplorerRPC.GetValidatorUptime)

      return IndexerGrpcExplorerTransformer.getValidatorUptimeResponseToValidatorUptime(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchPeggyDepositTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    receiver?: string
    sender?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetPeggyDepositTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    try {
      const response = await this.request<
        GetPeggyDepositTxsRequest,
        GetPeggyDepositTxsResponse,
        typeof InjectiveExplorerRPC.GetPeggyDepositTxs
      >(request, InjectiveExplorerRPC.GetPeggyDepositTxs)

      return IndexerGrpcExplorerTransformer.getPeggyDepositTxsResponseToPeggyDepositTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchPeggyWithdrawalTxs({
    sender,
    receiver,
    limit,
    skip,
  }: {
    sender?: string
    receiver?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetPeggyWithdrawalTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    try {
      const response = await this.request<
        GetPeggyWithdrawalTxsRequest,
        GetPeggyWithdrawalTxsResponse,
        typeof InjectiveExplorerRPC.GetPeggyWithdrawalTxs
      >(request, InjectiveExplorerRPC.GetPeggyWithdrawalTxs)

      return IndexerGrpcExplorerTransformer.getPeggyWithdrawalTxsResponseToPeggyWithdrawalTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBlocks({
    before,
    after,
    limit,
  }: {
    before?: number
    after?: number
    limit?: number
  }) {
    const request = new GetBlocksRequest()

    if (before) {
      request.setBefore(before)
    }

    if (after) {
      request.setAfter(after)
    }

    if (limit) {
      request.setLimit(limit)
    }

    try {
      const response = await this.request<
        GetBlocksRequest,
        GetBlocksResponse,
        typeof InjectiveExplorerRPC.GetBlocks
      >(request, InjectiveExplorerRPC.GetBlocks)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBlock(id: string) {
    const request = new GetBlockRequest()

    request.setId(id)

    try {
      const response = await this.request<
        GetBlockRequest,
        GetBlockResponse,
        typeof InjectiveExplorerRPC.GetBlock
      >(request, InjectiveExplorerRPC.GetBlock)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchTxs({
    before,
    after,
    limit,
    skip,
    type,
    module,
  }: {
    before?: number
    after?: number
    limit?: number
    skip?: number
    type?: string
    module?: string
  }) {
    const request = new GetTxsRequest()

    if (before) {
      request.setBefore(before)
    }

    if (after) {
      request.setAfter(after)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    if (type) {
      request.setType(type)
    }

    if (module) {
      request.setModule(module)
    }

    try {
      const response = await this.request<
        GetTxsRequest,
        GetTxsResponse,
        typeof InjectiveExplorerRPC.GetTxs
      >(request, InjectiveExplorerRPC.GetTxs)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchIBCTransferTxs({
    sender,
    receiver,
    srcChannel,
    srcPort,
    destChannel,
    destPort,
    limit,
    skip,
  }: {
    sender?: string
    receiver?: string
    srcChannel?: string
    srcPort?: string
    destChannel?: string
    destPort?: string
    limit?: number
    skip?: number
  }) {
    const request = new GetIBCTransferTxsRequest()

    if (sender) {
      request.setSender(sender)
    }

    if (receiver) {
      request.setReceiver(receiver)
    }

    if (limit) {
      request.setLimit(limit)
    }

    if (skip) {
      request.setSkip(skip)
    }

    if (srcChannel) {
      request.setSrcChannel(srcChannel)
    }

    if (srcPort) {
      request.setSrcPort(srcPort)
    }

    if (destChannel) {
      request.setDestChannel(destChannel)
    }

    if (destPort) {
      request.setDestPort(destPort)
    }

    try {
      const response = await this.request<
        GetIBCTransferTxsRequest,
        GetIBCTransferTxsResponse,
        typeof InjectiveExplorerRPC.GetIBCTransferTxs
      >(request, InjectiveExplorerRPC.GetIBCTransferTxs)

      return IndexerGrpcExplorerTransformer.getIBCTransferTxsResponseToIBCTransferTxs(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
