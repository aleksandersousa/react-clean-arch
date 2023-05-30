/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useRef } from 'react';
import { FormContext } from '@/presentation/contexts';
import Styles from './styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ type, name, placeholder }: Props) => {
  const { state, setState } = useContext(FormContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = state[`${name}Error`] as string;

  return (
    <div
      data-testid={`${name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        placeholder=" "
        ref={inputRef}
        title={error}
        data-testid={name}
        type={type}
        name={name}
        onChange={e => {
          setState((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
        }}
      />
      <label
        data-testid={`${name}-label`}
        title={error}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default Input;
