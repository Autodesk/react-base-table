import type { AlignmentValue, FrozenDirectionValue } from './types';

export const Alignment: Record<string, AlignmentValue> = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
};

export const FrozenDirection: Record<string, FrozenDirectionValue> = {
  LEFT: 'left',
  RIGHT: 'right',
  DEFAULT: true,
  NONE: false,
};

/**
 * Column for BaseTable
 */
const Column: React.FC & {
  Alignment: typeof Alignment;
  FrozenDirection: typeof FrozenDirection;
} = () => null;

Column.Alignment = Alignment;
Column.FrozenDirection = FrozenDirection;

export default Column;
