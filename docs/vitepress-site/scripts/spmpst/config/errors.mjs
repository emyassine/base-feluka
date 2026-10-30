export class ConfigError extends Error {
  constructor(file, pointer, message) {
    super(`${message} (${file}${pointer || ''})`)
    this.name = 'ConfigError'
    this.file = file
    this.pointer = pointer
  }
}

export class ErrorCollector {
  errors = []
  warnings = []

  add(file, pointer, message) { this.errors.push(new ConfigError(file, pointer, message)) }
  warn(file, pointer, message) { this.warnings.push(new ConfigError(file, pointer, message)) }
  throwIfAny() {
    if (this.errors.length) throw new AggregateError(this.errors, this.errors.map((error) => `- ${error.message}`).join('\n'))
  }
}
