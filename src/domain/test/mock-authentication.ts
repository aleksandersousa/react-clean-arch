import { faker } from '@faker-js/faker';
import { AuthenticationParams } from '@/domain/usecases/authetication';

const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export default mockAuthentication;
