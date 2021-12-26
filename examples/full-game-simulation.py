import asyncio
import json
import time

from nats.aio.client import Client as NATS
from nats.aio.errors import ErrConnectionClosed, ErrNoServers, ErrTimeout

# You will need nats-client to be installed:
# `pip install asyncio-nats-client` (https://github.com/nats-io/nats.py)


class JokerSimulator:
    def __init__(self, nc, serverName="server", randomSeed=""):
        self._nc = nc
        self._serverName = serverName
        self._randomSeed = randomSeed

    def reset(self, roomId, gameType, dring, position):
        return self._call(
            self._serverName + '.reset',
            '_'.join([
                roomId,
                gameType,
                dring,
                self._randomSeed,
                str(position)
            ])
        )

    def makeAction(self, roomId, actionId):
        return self._call(
            self._serverName + '.action',
            '_'.join([
                roomId,
                str(actionId)
            ])
        )

    async def _call(self, subject, message):
        try:
            response = await self._nc.request(subject, bytes(message, 'utf-8'))

            result = response.data.decode()

            return json.loads(result)

        except ErrNoServers:
            print("No listeners registered on the server")

        except ErrTimeout:
            print("Request timed out")

        except ErrConnectionClosed:
            print("Nats connection closed :(")


async def simulateOneRound(simulator, roomId):
    actionCount = 1
    result = await simulator.reset(roomId, 'ONLY9', '200', 1)

    while not result['isRoundFinished']:
        actionId = result['state']['validActions'][0]
        result = await simulator.makeAction(roomId, actionId)
        actionCount += 1

    return actionCount


# Usage
async def main(loop):
    nc = NATS()

    await nc.connect("localhost:4222", loop=loop)

    simulator = JokerSimulator(nc)

    print('Game starting...')

    start = time.time()

    actionCount = await asyncio.gather(*[simulateOneRound(simulator, 'room' + str(i)) for i in range(2000)])

    end = time.time()

    print('Game finished!', end-start,
          actionCount[0] * len(actionCount))

    # Benchmark (M1): 1550 rounds / sec.

    # Drain gracefully closes the connection, allowing all subscribers to
    # handle any pending messages inflight that the server may have sent.
    await nc.drain()


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(loop))
    loop.close()
