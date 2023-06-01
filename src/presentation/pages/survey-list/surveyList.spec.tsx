import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { mockAccountModel, mockSurveyListModel } from '@/domain/test';
import { UnexpectedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { BrowserRouter } from 'react-router-dom';
import SurveyList from './SurveyList';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveys;
  }
}

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy;
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <BrowserRouter>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </BrowserRouter>
    </ApiContext.Provider>
  );
  return { loadSurveyListSpy };
};

describe('SurveyList Component', () => {
  test('should present 4 empty items on start', async () => {
    makeSut();

    const surveyList = screen.getByTestId('survey-list');

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();

    await waitFor(() => surveyList);
  });

  test('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);

    await waitFor(() => screen.getByRole('heading'));
  });

  test('should render SurveyItems on success', async () => {
    const { loadSurveyListSpy } = makeSut();
    const surveyList = screen.getByTestId('survey-list');

    await waitFor(() => surveyList);

    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(
      loadSurveyListSpy.surveys.length
    );
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('should render error on failure', async () => {
    const error = new UnexpectedError();
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);

    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('error'));

    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  test('should call LoadSurveyList on reload', async () => {
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
