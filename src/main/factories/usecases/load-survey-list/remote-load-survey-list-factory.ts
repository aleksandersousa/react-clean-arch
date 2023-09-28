import { makeApiUrl } from '@/main/factories/htpp';
import { RemoteLoadSurveyList } from '@/data/usecases';
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyList = () => {
  const remoteLoadSurveyList = new RemoteLoadSurveyList(
    makeApiUrl('/surveys'),
    makeAuthorizeHttpGetClientDecorator(),
  );

  return remoteLoadSurveyList;
};
