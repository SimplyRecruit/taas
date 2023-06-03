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
  export class Invitation extends Base {
    constructor(
      language: Language,
      parameters: { name: string; link: string }
    ) {
      super(language, parameters)
    }
    protected static ids = {
      en: 'd-fec330a5361c406fbc0441ed861cf10c',
      tr: 'd-fec330a5361c406fbc0441ed861cf10c',
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
      tr: 'd-808240c1787147a183cab644da1360ad',
    }
  }
}
