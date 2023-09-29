import { makeApiUrl } from '@/main/factories/htpp';
import { RemoteLoadSurveyList } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyList = () => {
  const remoteLoadSurveyList = new RemoteLoadSurveyList(
    makeApiUrl('/surveys'),
    makeAuthorizeHttpClientDecorator(),
  );

  return remoteLoadSurveyList;
};
