import { Socket } from 'socket.io';

export class SocketsCenter {
  private static clients = new Map();

  public static register(client: Socket) {
    console.log('register', client);
    if (!this.clients.has(client.id)) {
      this.clients.set(client.id, client);
      console.log(`A user has joined!> ${this.clients.size}`, client.id);
      client.broadcast.emit('response', { message: `${client.id} joined` });
      client.on('disconnect', () => {
        this.clients.delete(client.id);
        console.log(`A user left!> ${this.clients.size}`, client.id);
      });
    }
  }

  public static broadcast(message: string) {
    this.clients.forEach((client) => {
      client.emit('response', { message });
    });
  }
}
