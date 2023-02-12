import { Language } from 'models'

export namespace EmailTemplate {
  export class Base {
    constructor(
      private language: Language,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      private params: { [key: string]: any }
    ) {}
    protected static ids: { [key in Language]: string } = { en: '', tr: '' }
    get id() {
      return (<typeof Base>this.constructor).ids[this.language]
    }
    get parameters() {
      return this.params
    }
  }
  export class Verification extends Base {
    constructor(
      language: Language,
      parameters: { name: string; link: string }
    ) {
      super(language, parameters)
    }
    protected static ids = {
      en: 'd-37ccd7664e5242319a3e979e30d788d1',
      tr: 'd-ef656d97a1d6440b82f68f7c5686c95f',
    }
  }
  export class ResetPassword extends Base {
    constructor(
      language: Language,
      parameters: { name: string; link: string }
    ) {
      super(language, parameters)
    }
    protected static ids = {
      en: 'd-808240c1787147a183cab644da1360ad',
      tr: '',
    }
  }
}
