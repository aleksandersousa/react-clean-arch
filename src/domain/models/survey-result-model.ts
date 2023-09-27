export type SurveyResultAnswer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
};

export type SurveyResultModel = {
  question: string;
  date: string;
  answers: SurveyResultAnswer[];
};
