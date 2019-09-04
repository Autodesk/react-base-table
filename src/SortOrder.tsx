import { Values } from './utils';

export type SortOrderValue = Values<typeof SortOrder>;

/**
 * Sort order for BaseTable
 */
const SortOrder = {
  /**
   * Sort data in ascending order
   */
  ASC: 'asc',
  /**
   * Sort data in descending order
   */
  DESC: 'desc',
} as const;

export default SortOrder;
