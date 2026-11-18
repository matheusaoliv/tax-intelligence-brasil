import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ObjectStorageService {
  private readonly client: S3Client;

  constructor() {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const credentials = accessKeyId && secretAccessKey
      ? { credentials: { accessKeyId, secretAccessKey } }
      : {};
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      ...credentials,
    });
  }

  private getBucket(): string {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) throw new InternalServerErrorException('Armazenamento de documentos não configurado.');
    return bucket;
  }

  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.getBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      ...(process.env.S3_SERVER_SIDE_ENCRYPTION === 'AES256'
        ? { ServerSideEncryption: 'AES256' as const }
        : {}),
    });
    await this.client.send(command);
  }

  async createDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.getBucket(), Key: key });
    return getSignedUrl(this.client, command, { expiresIn: 300 });
  }
}
