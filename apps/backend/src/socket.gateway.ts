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

    this.fileService.styleGuidesApi$.subscribe((styleGuides) => {
      this.wss.emit('update', { msg: 'data', type: 'styleGuides', data: styleGuides })
    })
    this.fileService.themes$.subscribe((themes) => {
      this.wss.emit('update', { msg: 'data', type: 'themes', data: themes })
    })
    this.fileService.designTokens$.subscribe((designTokens) => {
      this.wss.emit('update', { msg: 'data', type: 'designTokens', data: designTokens })
    })
    this.fileService.aliasTokens$.subscribe((aliasTokens) => {
      this.wss.emit('update', { msg: 'data', type: 'aliasTokens', data: aliasTokens })
    })
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`handleDisconnect ${client.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): WsResponse<string> {
    // client.emit('msgToClient', 'Hello world!')
    this.wss.emit('update', 'Hello world!')
    return { event: 'msgToClient', data: `Hello world! ${payload}` }
  }
}
