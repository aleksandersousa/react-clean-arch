import { makeApiUrl } from '@/main/factories/htpp';
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators';
import { RemoteLoadSurveyResult } from '@/data/usecases';

export const makeRemoteLoadSurveyResult = (id: string) => {
  const remoteLoadSurveyResult = new RemoteLoadSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizeHttpGetClientDecorator(),
  );

  return remoteLoadSurveyResult;
};
