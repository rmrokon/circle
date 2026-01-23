import { gameStatService, userService } from 'src/api/modules/bootstrap';
import { UserType } from 'src/api/modules/users/types';

export default async function resetLives() {
  const individualUsers = await userService.find({ type: UserType.Individual });
  const memberUsers = await userService.find({ type: UserType });
  const allUsers = [...individualUsers, ...memberUsers];

  await Promise.allSettled(
    allUsers?.map(async (user) => {
      const rawUser = await userService.findRawUserById(user.id!);
      //@ts-ignore
      const stat = await rawUser.getGameStats();
      await gameStatService.updateGameStat(stat?.id, { lives: 5 });
    }),
  );
}
