export type SurveyModel = {
  id: string;
  question: string;
  date: Date | string;
  didAnswer: boolean;
  answers: {
    image?: string;
    answer: string;
  }[];
};
