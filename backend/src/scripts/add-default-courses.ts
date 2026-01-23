import { CreateCourseValidationSchema } from '../api/modules/courses/validations';
import { courseService } from '../api/modules/bootstrap';
import { defaultCourses } from '../utils';

export async function addDefaultCourses() {
  await Promise.allSettled(
    defaultCourses.map(async (course) => {
      await courseService.upsertCourse(CreateCourseValidationSchema.parse(course));
    }),
  );

  console.log('----------- All defualt courses added -----------');
}
