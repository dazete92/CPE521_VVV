import asyncio
import websockets

async def hello(websocket, path):
	print('func called..')

start_server = websockets.serve(hello, 'localhost', 10000)
print('ran the server..')
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()
