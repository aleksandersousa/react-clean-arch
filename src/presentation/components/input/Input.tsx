/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ type, name, placeholder }: Props) => {
  const { errorState } = useContext(formContext);
  const error = errorState[name] as string;

  const getStatus = (): string => '🔴';

  const getTitle = (): string => error;

  return (
    <div className={Styles.inputWrap}>
      <input type={type} name={name} placeholder={placeholder} />
      <span data-testid={`${name}-status`} className={Styles.status} title={getTitle()}>
        {getStatus()}
      </span>
    </div>
  );
};

export default Input;
