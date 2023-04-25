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
  const { state, setState } = useContext(formContext);
  const error = state[`${name}Error`] as string;

  const getStatus = (): string => (error ? '🔴' : '🟢');

  const getTitle = (): string => error || 'Tudo certo!';

  const handleChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={Styles.inputWrap}>
      <input
        data-testid={name}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <span data-testid={`${name}-status`} className={Styles.status} title={getTitle()}>
        {getStatus()}
      </span>
    </div>
  );
};

export default Input;
