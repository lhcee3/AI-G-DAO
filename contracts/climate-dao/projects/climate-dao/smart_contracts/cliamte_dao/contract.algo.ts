import { Contract } from '@algorandfoundation/algorand-typescript'

export class CliamteDao extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
