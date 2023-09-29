import { makeApiUrl } from '@/main/factories/htpp';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { RemoteSaveSurveyResult } from '@/data/usecases';

export const makeRemoteSaveSurveyResult = (id: string) => {
  const remoteSaveSurveyResult = new RemoteSaveSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizeHttpClientDecorator(),
  );

  return remoteSaveSurveyResult;
};
