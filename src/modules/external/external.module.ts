import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { GoogleMapsService } from './services/google-maps.service';
import { ViaCepService } from './services/via-cep.service';
import { MelhorEnvioService } from './services/melhor-envio.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  providers: [GoogleMapsService, ViaCepService, MelhorEnvioService],
  exports: [GoogleMapsService, ViaCepService, MelhorEnvioService],
})
export class ExternalModule {} 