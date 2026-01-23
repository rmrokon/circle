import { IQuiz } from 'src/api/modules/quizzes/types';
import { optionService, questionService, quizService } from '../api/modules/bootstrap';
import { defaultProfessionalQuiz } from '../utils';

export async function addDefaultProfessionalQuiz() {
  const existingQuiz = await quizService.findQuizzes(defaultProfessionalQuiz.quiz);
  console.log(existingQuiz);
  let createdQuiz: Partial<IQuiz>;
  if (!existingQuiz.length) {
    createdQuiz = await quizService.createQuiz(defaultProfessionalQuiz.quiz);
  }
  // const options: string[] = [];

  // await Promise.allSettled(
  //   defaultQuiz.options.map(async (option) => {
  //     const existingOption = await optionService.findOptions(option);
  //     if (!existingOption.length) {
  //       const createdOption = await optionService.createOption(option);
  //       options.push(createdOption.id!);
  //     }
  //   }),
  // );
  // console.log('these are option Ids', options);
  await Promise.allSettled(
    defaultProfessionalQuiz.questions.map(async (question) => {
      const { options, ...rest } = question;
      const existingQuestion = await questionService.findQuestions(rest);
      if (!existingQuestion.length) {
        const createdQuestion = await questionService.createQuestion(rest);
        // await Promise.allSettled(
        //   options.map(async (opId) => {
        //     const option = await optionService.findOptionById(opId);
        //     //@ts-ignore
        //     await createdQuestion.addOption(option);
        //   }),
        // );
        await Promise.allSettled(
          options.map(async (option) => {
            const existingOption = await optionService.findOptions(option);
            console.log(existingOption);
            if (!existingOption.length) {
              const createdOption = await optionService.createOption(option);
              const questionRaw = await questionService.findQuestionById(createdQuestion!.id!);
              //@ts-ignore
              await questionRaw.addOption(createdOption);
            }
          }),
        );
        const quiz = await quizService.findQuizById(createdQuiz.id!);
        //@ts-ignore
        await quiz.addQuestion(createdQuestion);
      }
    }),
  );
  console.log('----------- Defualt Quiz added -----------');
}
