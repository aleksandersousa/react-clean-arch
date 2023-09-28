import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ApiContext } from '@/presentation/contexts';
import { mockAccountModel } from '@/domain/test';
import SurveyResult from './SurveyResult';

// type SutTypes = {
//   loadSurveyListSpy: LoadSurveyListSpy;
//   setCurrentAccountMock: (account: AccountModel) => void;
// };

const makeSut = () => {
  // const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <BrowserRouter>
        <SurveyResult />
      </BrowserRouter>
      ,
    </ApiContext.Provider>,
  );
  // return { loadSurveyListSpy, setCurrentAccountMock };
};

describe('SurveyResult Component', () => {
  test('Should present correct initial state', () => {
    makeSut();

    const surveyResult = screen.getByTestId('survey-result');

    expect(surveyResult.childElementCount).toBe(0);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });
});
