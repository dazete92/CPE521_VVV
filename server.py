import asyncio
import websockets

async def clientConnected(websocket, path):
	print('client connected..')
	while True:
		message = await websocket.recv()
		print (message)

start_server = websockets.serve(clientConnected, 'localhost', 10000)
print('Server Running on.')
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()
