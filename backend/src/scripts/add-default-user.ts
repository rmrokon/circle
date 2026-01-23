import { UserType } from '../api/modules/users/types';
import { credentialService, userService } from '../api/modules/bootstrap';

export async function addDefaultUser() {
  const existingUser = await userService.findUserByEmail('user@email.com');
  if (!existingUser) {
    const registeredUser = await credentialService.createCredential({
      firstName: 'default',
      lastName: 'user',
      email: 'user@email.com',
      phone: '12345678',
      password: '@abc1234',
      type: UserType.Individual,
    });

    console.log('----------- Defualt user added -----------');
    console.log(registeredUser);
  }
}
