export type SurveyResultAnswer = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
};

export type SurveyResultModel = {
  question: string;
  date: Date | string;
  answers: SurveyResultAnswer[];
};
