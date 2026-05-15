export function info(message: string, meta?: any) {
  const payload = { level: 'info', message, ...(meta ? { meta } : {}) }
  console.log(JSON.stringify(payload))
}

export function error(message: string, meta?: any) {
  const payload = { level: 'error', message, ...(meta ? { meta } : {}) }
  console.error(JSON.stringify(payload))
}

export function warn(message: string, meta?: any) {
  const payload = { level: 'warn', message, ...(meta ? { meta } : {}) }
  console.warn(JSON.stringify(payload))
}

export default { info, error, warn }
