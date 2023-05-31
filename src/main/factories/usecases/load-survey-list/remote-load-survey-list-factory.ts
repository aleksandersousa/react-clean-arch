import { makeAxiosHttpClient } from '@/main/factories/htpp/axios-http-client-factory';
import { makeApiUrl } from '@/main/factories/htpp/api-url-factory';
import { RemoteLoadSurveyList } from '@/data/usecases/load-survey-list/remote-load-survey-list';

export const makeRemoteLoadSurveyList = () => {
  const remoteLoadSurveyList = new RemoteLoadSurveyList(
    makeApiUrl('/surveys'),
    makeAxiosHttpClient()
  );

  return remoteLoadSurveyList;
};
