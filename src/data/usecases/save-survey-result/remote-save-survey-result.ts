import { HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<SurveyResultModel>,
  ) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'put',
      body: data,
    });
    const surveyResult = httpResponse.body;

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return { ...surveyResult, date: new Date(surveyResult?.date) };
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
