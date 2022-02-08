import { AccountAddress } from '@injectivelabs/ts-types'
import { bech32 } from 'bech32'
import { Address } from 'ethereumjs-util'

export const getInjectiveAddress = (address: AccountAddress): string => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer()

  return bech32.encode('inj', bech32.toWords(addressBuffer))
}

export const getAddressFromInjectiveAddress = (
  address: AccountAddress,
): string => {
  if (address.startsWith('0x')) {
    return address
  }

  return `0x${Buffer.from(
    bech32.fromWords(bech32.decode(address).words),
  ).toString('hex')}`
}

export class AddressTransformer {
  static getInjectiveAddress = getInjectiveAddress

  static getAddressFromInjectiveAddress = getAddressFromInjectiveAddress
}