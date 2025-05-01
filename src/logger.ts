import pino from 'pino'

const consoleTransport = pino.transport({
  target: 'pino-pretty',
})

const streams = [{ level: 'info', stream: consoleTransport }]

// TODO: load certain config from env vars
// TODO: allow for log config on lib init
const logger = pino(
  {
    enabled: true,
    base: { name: 'migris' },
  },
  pino.multistream(streams),
)

export { logger }
export type Logger = pino.Logger
