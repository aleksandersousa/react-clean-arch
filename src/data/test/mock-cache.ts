import { faker } from '@faker-js/faker';
import { GetStorage } from '@/data/protocols/cache';

export class GetStorageSpy implements GetStorage {
  key: string;
  value = faker.string.alpha();

  get(key: string) {
    this.key = key;
    return this.value;
  }
}
