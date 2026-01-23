import { QSendWeeklyNotification } from '../jobs/send-weekly-notification-queue';

export async function enqueueWeeklyNotifications() {
  const res = await Promise.allSettled(
    (['completed', 'wait', 'active', 'delayed', 'failed', 'paused'] as const).map((status) =>
      QSendWeeklyNotification.clean(0, status),
    ),
  );
  const errors = res.filter((x) => x.status === 'rejected').map((x) => x.reason);
  if (errors.length) {
    console.warn('Some jobs could not be cleaned', errors);
  }
  return await QSendWeeklyNotification.add(undefined, {
    repeat: { cron: '0 0 * * 6' },
  });
}
