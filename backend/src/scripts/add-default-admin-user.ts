import { UserType } from '../api/modules/users/types';
import { userService } from '../api/modules/bootstrap';

export async function addDefaultAdminUser() {
  const existingUser = await userService.findUserByEmail('admin@filgood.com');
  if (!existingUser) {
    const registeredUser = await userService.createAdminUser({
      firstName: 'default',
      lastName: 'admin',
      email: 'admin@filgood.com',
      phone: '12345678',
      type: UserType.Admin,
    });

    console.log('----------- Defualt Admin user added -----------');
    console.log(registeredUser);
  }
}
