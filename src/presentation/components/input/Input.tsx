/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useRef } from 'react';
import formContext from '@/presentation/contexts/form/form-context';
import Styles from './styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ type, name, placeholder }: Props) => {
  const { state, setState } = useContext(formContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = state[`${name}Error`] as string;

  return (
    <div className={Styles.inputWrap}>
      <input
        placeholder=" "
        ref={inputRef}
        data-testid={name}
        type={type}
        name={name}
        onChange={e => {
          setState((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
        }}
      />
      <label
        data-testid={`${name}-label`}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {placeholder}
      </label>
      <span
        data-testid={`${name}-status`}
        className={Styles.status}
        title={error || 'Tudo certo!'}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  );
};

export default Input;
