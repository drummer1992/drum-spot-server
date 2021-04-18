import loggerDecorator from './legacy/logger'

export function Logger(instance, serviceMethod, descriptor) {
  descriptor.value = loggerDecorator(descriptor.value)

  return descriptor
}