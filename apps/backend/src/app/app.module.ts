import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AliasTokenController } from '../controllers/alias-token.controller'
import { DesignTokenController } from '../controllers/design-token.controller'
import { StyleGuideController } from '../controllers/style-guide.controller'
import { StyleController } from '../controllers/style.controller'
import { ThemeController } from '../controllers/theme.controller'
import {
  AliasTokenService,
  ConfigService,
  DesignTokenService,
  FileService,
  StyleGuideService,
  SyncService,
  ThemeService,
} from '../services'
import { SocketGateway } from '../socket.gateway'
import { AppController } from './app.controller'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
  ],
  providers: [
    ConfigService,
    AliasTokenService,
    DesignTokenService,
    StyleGuideService,
    ThemeService,
    SyncService,
    SocketGateway,
    FileService,
  ],
  controllers: [
    AppController,
    AliasTokenController,
    StyleGuideController,
    StyleController,
    DesignTokenController,
    ThemeController,
  ],
})
export class AppModule {}
