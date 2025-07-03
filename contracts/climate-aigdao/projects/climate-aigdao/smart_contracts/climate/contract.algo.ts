import { Contract } from '@algorandfoundation/algorand-typescript'

export class Climate extends Contract {
  hello(name: string): string {
    return `Hello, ${name}`
  }
}
