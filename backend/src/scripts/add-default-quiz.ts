import { UserType } from '../api/modules/users/types';
import { quizService, userService } from '../api/modules/bootstrap';
import Quiz from '../api/modules/quizzes/model';

export async function addDefaultQuiz() {
  const n = await Quiz.count({ where: { systemQuiz: true, default: true } });
  if (n) return console.log('----------- Default Quiz found -----------');
  const [user] = await userService.find({ type: UserType.Admin });
  if (!user || !user.id) throw new Error('Default user not found!');

  const [test] = await quizService.generateTestsWithAI(
    {
      numberOfTests: 1,
      numberOfQuestions: 5,
      difficulty: 'medium',
      subject: 'Mental health',
      language: 'English',
      toneOfVoice: [],
    },
    user.id,
  );
  test.default = true;
  const { questions, ...quiz } = test;

  await quizService.createQuizWithQuestionAndOptions({ quiz, questions });

  console.log('----------- Default Quiz added -----------');
}
