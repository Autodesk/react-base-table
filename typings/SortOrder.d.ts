import { Values } from './utils';
export declare type SortOrderValue = Values<typeof SortOrder>;
/**
 * Sort order for BaseTable
 */
declare const SortOrder: {
    /**
     * Sort data in ascending order
     */
    readonly ASC: "asc";
    /**
     * Sort data in descending order
     */
    readonly DESC: "desc";
};
export default SortOrder;
