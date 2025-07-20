import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { FavoriteModule } from './favorite/favorite.module';
import { GenreModule } from './genre/genre.module';
import { HistoryModule } from './history/history.module';
import { VideosModule } from './videos/videos.module';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailModule,
    FavoriteModule,
    GenreModule,
    HistoryModule,
    VideosModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProfileService],
})
export class AppModule {}
