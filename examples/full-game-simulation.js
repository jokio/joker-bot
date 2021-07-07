const { connect, StringCodec } = require('nats')

async function run() {
  const client = await connect({ servers: ['nats://localhost:4222'] })

  const now = Date.now()

  const simulator = new JokerSimulator(
    client,
    'server',
    'RANDOM_SEED',
  )

  let result = await simulator.reset('room1', 'ONLY9', '200', 1)

  while (!result.isGameFinished) {
    result = await simulator.action(
      'room1',
      result.state.validActions[0],
    )
  }

  console.log('duration', Date.now() - now)
}

class JokerSimulator {
  client
  serverName
  randomSeed
  sc

  constructor(client, serverName, randomSeed = '') {
    this.client = client
    this.serverName = serverName
    this.randomSeed = randomSeed

    this.sc = StringCodec()
  }

  async reset(roomId, gameType, dring, position = 1) {
    return this.call(
      `${this.serverName}.reset`,
      `${roomId}_${gameType}_${dring}_${this.randomSeed}_${position}`,
    )
  }

  async action(roomId, actionId) {
    return this.call(
      `${this.serverName}.action`,
      `${roomId}_${actionId}`,
    )
  }

  async call(subject, message) {
    const response = await this.client.request(
      subject,
      this.sc.encode(message),
    )

    let result = JSON.parse(this.sc.decode(response.data))

    return result
  }
}

run()
