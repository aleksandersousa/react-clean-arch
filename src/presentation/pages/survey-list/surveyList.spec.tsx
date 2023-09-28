import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { BrowserRouter } from 'react-router-dom';
import { AccountModel } from '@/domain/models';
import SurveyList from './SurveyList';

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <BrowserRouter>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </BrowserRouter>
    </ApiContext.Provider>,
  );
  return { loadSurveyListSpy, setCurrentAccountMock };
};

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut();

    const surveyList = screen.getByTestId('survey-list');

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    await waitFor(() => surveyList);
  });

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);

    await waitFor(() => screen.getByRole('heading'));
  });

  test('Should render SurveyItems on success', async () => {
    const { loadSurveyListSpy } = makeSut();
    const surveyList = screen.getByTestId('survey-list');

    await waitFor(() => surveyList);

    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(
      loadSurveyListSpy.surveys.length,
    );
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('Should render error on UnexpectedError', async () => {
    const error = new UnexpectedError();
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);

    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  test('Should logout on access denied', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest
      .spyOn(loadSurveyListSpy, 'loadAll')
      .mockRejectedValueOnce(new AccessDeniedError());

    const { setCurrentAccountMock } = makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('content-wrap'));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined);
    expect(window.location.pathname).toBe('/login');
  });

  test('Should call LoadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError());

    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('error'));
    fireEvent.click(screen.getByTestId('reload'));

    expect(loadSurveyListSpy.callsCount).toBe(1);

    if (!screen.queryByTestId('survey-list')) {
      await waitFor(() => screen.getByTestId('error'));
    } else {
      await waitFor(() => screen.getByTestId('survey-list'));
    }
  });
});
