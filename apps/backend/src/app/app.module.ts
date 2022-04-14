import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AliasTokenController } from '../controllers/alias-token.controller'
import { DesignTokenController } from '../controllers/design-token.controller'
import { StyleGuideController } from '../controllers/style-guide.controller'
import { StyleController } from '../controllers/style.controller'
import { ThemeController } from '../controllers/theme.controller'
import { AliasTokenService } from '../services/alias-token.service'
import { ConfigService } from '../services/config.service'
import { DesignTokenService } from '../services/design-token.service'
import { StyleGuideService } from '../services/style-guide.service'
import { SyncService } from '../services/sync.service'
import { ThemeService } from '../services/theme.service'
import { SocketGateway } from '../socket.gateway'
import { AppController } from './app.controller'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
  ],
  controllers: [
    AppController,
    AliasTokenController,
    StyleGuideController,
    StyleController,
    DesignTokenController,
    ThemeController,
  ],
  providers: [
    AliasTokenService,
    DesignTokenService,
    StyleGuideService,
    ThemeService,
    SyncService,
    ConfigService,
    SocketGateway,
  ],
})
export class AppModule {}
