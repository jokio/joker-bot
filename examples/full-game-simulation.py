import asyncio
import json
import time

from nats.aio.client import Client as NATS
from nats.aio.errors import ErrConnectionClosed, ErrNoServers, ErrTimeout

# You will need nats-client to be installed:
# `pip install asyncio-nats-client` (https://github.com/nats-io/nats.py)


class JokerSimulator:
    _cache = {}

    def __init__(self, nc, serverName="server", randomSeed=""):
        self._nc = nc
        self._serverName = serverName
        self._randomSeed = randomSeed

    async def reset(self, roomId, gameType, dring, position):
        result = await self._call(
            self._serverName + '.reset',
            '_'.join([
                roomId,
                gameType,
                dring,
                self._randomSeed,
                str(position)
            ])
        )

        self._cache[roomId] = result

        return result

    async def makeAction(self, roomId, actionId):
        result = await self._call(
            self._serverName + '.action',
            '_'.join([
                roomId,
                str(actionId)
            ])
        )

        self._cache[roomId] = result

        return result

    def getState(self, roomId):
        return self._cache[roomId]['state']

    def validActions(self, roomId):
        return self._cache[roomId]['state']['validActions']

    def deleteRoomCache(self, roomId):
        del self._cache[roomId]

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

    simulator.deleteRoomCache(roomId)

    return actionCount


# Usage
async def main(loop):
    nc = NATS()

    await nc.connect("localhost:4222", loop=loop)

    simulator = JokerSimulator(nc)

    print('Game starting...')

    start = time.time()

    simulatedResults = await asyncio.gather(*[simulateOneRound(simulator, 'room' + str(i)) for i in range(1555)])

    end = time.time()

    print('Game finished!', end-start,
          simulatedResults[0] * len(simulatedResults))

    # Benchmark (M1): 1555 rounds / second = 5.5M rounds / hour

    # Drain gracefully closes the connection, allowing all subscribers to
    # handle any pending messages inflight that the server may have sent.
    await nc.drain()


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(loop))
    loop.close()
