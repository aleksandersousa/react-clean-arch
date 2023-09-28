import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApiContext } from '@/presentation/contexts';
import { LoadSurveyResultSpy, mockAccountModel } from '@/domain/test';
import SurveyResult from './SurveyResult';

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
  // const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <BrowserRouter>
        <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
      </BrowserRouter>
      ,
    </ApiContext.Provider>,
  );
  return { loadSurveyResultSpy };
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

  test('should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));

    expect(loadSurveyResultSpy.callsCount).toBe(1);
  });
});
