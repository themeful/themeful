import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { Server } from 'http'
import { Socket } from 'socket.io'
import { FileService } from './services'

@WebSocketGateway({ cors: true, serveClient: false })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  private logger: Logger = new Logger('SocketGateway')

  constructor(private readonly fileService: FileService) {}

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(client: Socket) {
    this.logger.log(`handleConnection ${client.id}`)
    this.wss.emit('update', { msg: 'connected' })

    this.fileService.styleGuidesApi$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'styleGuides', data })
    })
    this.fileService.themes$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'themes', data })
    })
    this.fileService.designTokens$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'designTokens', data })
    })
    this.fileService.aliasTokens$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'aliasTokens', data })
    })
    this.fileService.components$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'components', data })
    })
    this.fileService.config$().subscribe((data) => {
      this.wss.emit('update', { msg: 'data', type: 'config', data })
    })
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`handleDisconnect ${client.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(_client: Socket, payload: string): WsResponse<string> {
    // client.emit('msgToClient', 'Hello world!')
    this.wss.emit('update', 'Hello world!')
    return { event: 'msgToClient', data: `Hello world! ${payload}` }
  }
}
