import { ConcreteException } from '../exception'
import { ErrorContext, ErrorType } from '../types'

const isCommonLockedError = (error: string) =>
  !!(
    error.includes('Ledger device: Incorrect length') ||
    error.includes('Ledger device: INS_NOT_SUPPORTED') ||
    error.includes('Ledger device: CLA_NOT_SUPPORTED') ||
    error.includes('Failed to open the device') ||
    error.includes('Failed to open the device') ||
    error.includes('Ledger Device is busy') ||
    error.includes('UNKNOWN_ERROR')
  )

export class LedgerException extends ConcreteException {
  constructor(error: Error, context?: ErrorContext) {
    super(error, context)

    this.type = ErrorType.WalletError
  }

  public parseMessage(): void {
    const { message } = this

    if (isCommonLockedError(message)) {
      this.setMessage(
        'Please ensure your Ledger is connected, unlocked and your Ethereum app is open.',
      )
    }

    if (message.includes('No device selected.')) {
      this.setMessage(
        'Please make sure your Ledger device is connected, unlocked and your Ethereum app is open',
      )
    }

    if (message.includes('Unable to set device configuration.')) {
      this.setMessage(
        'Please restart your Ledger device and try connecting again',
      )
    }

    if (message.includes('Cannot read properties of undefined')) {
      this.setMessage('Please make sure your Ledger device is connected')
    }

    if (message.includes('Ledger device: Condition of use not satisfied')) {
      this.setMessage('The request has been rejected')
    }

    if (message.includes('U2F browser support is needed for Ledger.')) {
      this.setMessage(
        'Please use the latest Chrome/Firefox browser versions to connect with your Ledger device',
      )
    }
  }
}
