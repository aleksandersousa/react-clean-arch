import Styles from './styles.scss';

type Props = React.HTMLAttributes<HTMLElement> & { isNegative?: boolean };

const Spinner: React.FC<Props> = ({ className, isNegative }) => {
  const negativeClass = isNegative ? Styles.negative : '';

  return (
    <div
      data-testid="spinner"
      className={[Styles.spinner, negativeClass, className].join(' ')}
    >
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Spinner;
