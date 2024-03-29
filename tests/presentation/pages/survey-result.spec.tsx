import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  LoadSurveyResultSpy,
  SaveSurveyResultSpy,
  mockAccountModel,
  mockSurveyResultModel,
} from '@/tests/domain/mocks';
import { UtilsHelper } from '@/tests/presentation/mocks';
import { AccountModel } from '@/domain/models';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { SurveyResult } from '@/presentation/pages';

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy;
  saveSurveyResultSpy?: SaveSurveyResultSpy;
};

const makeSut = ({
  loadSurveyResultSpy = new LoadSurveyResultSpy(),
  saveSurveyResultSpy = new SaveSurveyResultSpy(),
}: SutParams = {}): SutTypes => {
  const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <BrowserRouter>
        <SurveyResult
          loadSurveyResult={loadSurveyResultSpy}
          saveSurveyResult={saveSurveyResultSpy}
        />
      </BrowserRouter>
      ,
    </ApiContext.Provider>,
  );
  return { loadSurveyResultSpy, saveSurveyResultSpy, setCurrentAccountMock };
};

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut();

    const surveyResult = screen.getByTestId('survey-result');

    expect(surveyResult.childElementCount).toBe(0);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    await waitFor(() => surveyResult);
  });

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    expect(loadSurveyResultSpy.callsCount).toBe(1);
  });

  test('Should present SurveyResult data on success', async () => {
    const surveyResult = {
      ...mockSurveyResultModel(),
      date: new Date('2020-01-10T00:00:00'),
    };

    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    loadSurveyResultSpy.surveyResult = surveyResult;

    makeSut({ loadSurveyResultSpy });

    await waitFor(() => screen.getByTestId('survey-result'));

    expect(screen.getByTestId('day')).toHaveTextContent('10');
    expect(screen.getByTestId('month')).toHaveTextContent('jan');
    expect(screen.getByTestId('year')).toHaveTextContent('2020');

    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question);
    expect(screen.getByTestId('answers').childElementCount).toBe(2);

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    expect(answersWrap[0]).toHaveClass('active');
    expect(answersWrap[1]).not.toHaveClass('active');

    const images = screen.queryAllByTestId('image');
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image);
    expect(images[1]).toBeFalsy();

    const answers = screen.queryAllByTestId('answer');
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer);
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer);

    const percents = screen.queryAllByTestId('percent');
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`);
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`);
  });

  test('Should render error on UnexpectedError in LoadSurveyResult', async () => {
    const error = new UnexpectedError();
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error);

    makeSut({ loadSurveyResultSpy });

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.queryByTestId('question')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    jest
      .spyOn(loadSurveyResultSpy, 'load')
      .mockRejectedValueOnce(new AccessDeniedError());

    const { setCurrentAccountMock } = makeSut({ loadSurveyResultSpy });

    await waitFor(() => screen.getByTestId('survey-result'));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(window.location.pathname).toBe('/login');
  });

  test('should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new UnexpectedError());

    makeSut({ loadSurveyResultSpy });

    await waitFor(() => screen.getByTestId('error'));
    fireEvent.click(screen.getByTestId('reload'));

    expect(loadSurveyResultSpy.callsCount).toBe(1);

    if (!screen.queryByTestId('survey-result')) {
      await waitFor(() => screen.getByTestId('error'));
    } else {
      await waitFor(() => screen.getByTestId('survey-result'));
    }
  });

  test('Should go to SurveyList on back button click', async () => {
    makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    UtilsHelper.startInRoute(`/surveys/any_id`);

    fireEvent.click(screen.getByTestId('back-button'));

    expect(window.location.pathname).toBe(`/`);
  });

  test('Should not present loading on active answer click', async () => {
    makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    fireEvent.click(answersWrap[0]);

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('Should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    fireEvent.click(answersWrap[1]);

    expect(screen.queryByTestId('loading')).toBeInTheDocument();
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer,
    });

    await waitFor(() => screen.getByTestId('survey-result'));
  });

  test('Should render error on UnexpectedError in SaveSurveyResult', async () => {
    const error = new UnexpectedError();
    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error);

    makeSut({ saveSurveyResultSpy });

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    await waitFor(() => fireEvent.click(answersWrap[1]));

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.queryByTestId('question')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  test('Should logout on AccessDeniedError in SaveSurveyResult', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    jest
      .spyOn(saveSurveyResultSpy, 'save')
      .mockRejectedValueOnce(new AccessDeniedError());

    const { setCurrentAccountMock } = makeSut({ saveSurveyResultSpy });

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    await waitFor(() => fireEvent.click(answersWrap[1]));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(window.location.pathname).toBe('/login');
  });

  test('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const surveyResult = {
      ...mockSurveyResultModel(),
      date: new Date('2018-02-20T00:00:00'),
    };

    const saveSurveyResultSpy = new SaveSurveyResultSpy();
    saveSurveyResultSpy.surveyResult = surveyResult;

    makeSut({ saveSurveyResultSpy });

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    await waitFor(() => fireEvent.click(answersWrap[1]));

    expect(screen.getByTestId('day')).toHaveTextContent('20');
    expect(screen.getByTestId('month')).toHaveTextContent('fev');
    expect(screen.getByTestId('year')).toHaveTextContent('2018');

    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question);
    expect(screen.getByTestId('answers').childElementCount).toBe(2);

    expect(answersWrap[0]).toHaveClass('active');
    expect(answersWrap[1]).not.toHaveClass('active');

    const images = screen.queryAllByTestId('image');
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image);
    expect(images[1]).toBeFalsy();

    const answers = screen.queryAllByTestId('answer');
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer);
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer);

    const percents = screen.queryAllByTestId('percent');
    expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`);
    expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`);

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('Should prevent multiple answer click', async () => {
    const { saveSurveyResultSpy } = makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    const answersWrap = screen.queryAllByTestId('answer-wrap');
    await waitFor(() => {
      fireEvent.click(answersWrap[1]);
      fireEvent.click(answersWrap[1]);
    });

    expect(saveSurveyResultSpy.callsCount).toBe(1);
  });
});
