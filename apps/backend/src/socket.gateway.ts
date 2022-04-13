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
import { AliasTokenService } from './services/alias-token.service'
import { DesignTokenService } from './services/design-token.service'
import { StyleGuideService } from './services/style-guide.service'
import { ThemeService } from './services/theme.service'

@WebSocketGateway({ cors: true, serveClient: false })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  private logger: Logger = new Logger('SocketGateway')

  constructor(
    private styleGuideService: StyleGuideService,
    private themeService: ThemeService,
    private designTokenService: DesignTokenService,
    private aliasTokenService: AliasTokenService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`handleConnection ${client.id}`)
    this.wss.emit('update', { msg: 'connected' })

    this.styleGuideService.styleGuides$.subscribe((styleGuides) => {
      this.wss.emit('update', { msg: 'data', type: 'styleGuides', data: styleGuides })
    })
    this.styleGuideService.styles$.subscribe((styles) => {
      this.wss.emit('update', { msg: 'data', type: 'styles', data: styles })
    })
    this.themeService.themes$.subscribe((themes) => {
      this.wss.emit('update', { msg: 'data', type: 'themes', data: themes })
    })
    this.designTokenService.designTokens$.subscribe((designTokens) => {
      this.wss.emit('update', { msg: 'data', type: 'designTokens', data: designTokens })
    })
    this.aliasTokenService.aliasTokens$.subscribe((aliasTokens) => {
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
