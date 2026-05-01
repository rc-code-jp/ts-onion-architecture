import { IUuidGenerator } from '@/application/services/IUuidGenerator';
import { v4 as uuidv4 } from 'uuid';

export class UuidGenerator implements IUuidGenerator {
  generate(): string {
    return uuidv4();
  }
}
