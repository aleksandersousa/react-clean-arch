import { HttpGetClient } from '@/data/protocols/http';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases';

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<SurveyResultModel>
  ) {}

  async load(): Promise<SurveyResultModel> {
    await this.httpGetClient.get({ url: this.url });
    return { answers: [], date: new Date(), question: 'question' };
  }
}
