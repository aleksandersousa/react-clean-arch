import { makeApiUrl } from '@/main/factories/htpp';
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list';
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyList = () => {
  const remoteLoadSurveyList = new RemoteLoadSurveyList(
    makeApiUrl('/surveys'),
    makeAuthorizeHttpGetClientDecorator()
  );

  return remoteLoadSurveyList;
};
