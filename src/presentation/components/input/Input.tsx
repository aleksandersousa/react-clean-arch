/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Styles from './styles.scss';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = ({ type, name, placeholder }: Props) => (
  <div className={Styles.inputWrap}>
    <input type={type} name={name} placeholder={placeholder} />
  </div>
);

export default Input;
