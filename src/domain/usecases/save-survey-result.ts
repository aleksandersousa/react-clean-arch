import { SurveyResultModel } from '@/domain/models';

export type SaveSurveyResultParams = {
  answer: string;
};

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>;
}
