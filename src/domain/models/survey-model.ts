export type SurveyModel = {
  id: string;
  question: string;
  date: Date;
  didAnswer: boolean;
  answers: {
    image?: string;
    answer: string;
  }[];
};
