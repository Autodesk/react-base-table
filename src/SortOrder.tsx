import { Values } from './type-utils';

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

export type SortOrderValue = Values<typeof SortOrder>;
export default SortOrder;
