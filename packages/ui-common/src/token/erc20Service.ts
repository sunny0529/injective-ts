import { AlchemyApi } from '@injectivelabs/alchemy-api'
import { BigNumberInWei } from '@injectivelabs/utils'
import { contractAddresses } from '@injectivelabs/contracts'
import { TokenMeta } from '@injectivelabs/token-metadata'
import { Token, TokenWithBalance } from './types'
import { ServiceOptions } from '../types'

export class TokenErc20Service {
  private options: ServiceOptions

  private alchemyApi: AlchemyApi

  constructor({
    options,
    alchemyRpcEndpoint,
  }: {
    options: ServiceOptions
    alchemyRpcEndpoint: string
  }) {
    this.options = options
    this.alchemyApi = new AlchemyApi(alchemyRpcEndpoint)
  }

  async fetchTokenBalanceAndAllowance({
    address,
    token,
  }: {
    address: string
    token: Token
  }): Promise<TokenWithBalance> {
    if (token.denom.startsWith('ibc/')) {
      return {
        ...token,
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
      const { options } = this
      const tokenBalances = await this.alchemyApi.fetchTokenBalances({
        address,
        contractAddresses: [token.address],
      })
      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance) =>
            (
              tokenBalance as unknown as { contractAddress: string }
            ).contractAddress.toLowerCase() === token.address.toLowerCase(),
        )
      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

      const allowance = await this.alchemyApi.fetchTokenAllowance({
        owner: address,
        spender: contractAddresses[options.chainId].peggy,
        contract: token.address,
      })

      return {
        ...token,
        balance: new BigNumberInWei(balance || 0).toFixed(),
        allowance: new BigNumberInWei(allowance || 0).toFixed(),
      }
    } catch (e) {
      return {
        ...token,
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }
  }

  async fetchTokenMeta(denom: string): Promise<TokenMeta> {
    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    try {
      const tokenMeta = await this.alchemyApi.fetchTokenMetadata(address)

      if (!tokenMeta) {
        throw new Error(`Token ${denom} not found`)
      }

      return {
        address,
        name: tokenMeta.name as string,
        logo: tokenMeta.logo as string,
        symbol: tokenMeta.symbol as string,
        decimals: tokenMeta.decimals as number,
        coinGeckoId: '',
      }
    } catch (e) {
      throw new Error(`Token ${denom} not found`)
    }
  }
}
