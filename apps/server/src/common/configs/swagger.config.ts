import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('CoSider API')
  .setDescription('CoSider 서비스 연동 API 명세서')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();
