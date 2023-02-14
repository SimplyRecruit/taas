/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleObject } from 'antd/es/form'
import { validate } from 'class-validator'

export default class Model {
  static create<T extends Model>(this: new () => T, obj: T): T {
    const instance = new this()
    Object.keys(obj).forEach(key => {
      ;(instance as any)[key] = (obj as any)[key]
    })
    return instance
  }

  static createPartially<T extends Model>(
    this: new () => T,
    obj: Partial<T>
  ): T {
    const instance = new this()
    Object.keys(obj).forEach(key => {
      ;(instance as any)[key] = (obj as any)[key]
    })
    return instance
  }

  static validator<T extends typeof Model>(
    this: T,
    field: keyof InstanceType<T>
  ) {
    return async (_: RuleObject, value: any) => {
      const bodyToValidate = this.createPartially({ [field]: value })
      const errors = await validate(bodyToValidate, {
        skipUndefinedProperties: true,
      })
      if (errors?.length > 0) {
        console.log(errors)
        return Promise.reject(new Error('Validation errors'))
      } else {
        return Promise.resolve()
      }
    }
  }
}
