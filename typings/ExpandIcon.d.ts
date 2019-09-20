import React from 'react';
import PropTypes from 'prop-types';
import { fn } from './utils';
export interface ExpandIconProps {
    expandable?: boolean;
    expanded?: boolean;
    indentSize?: number;
    depth?: number;
    onExpand?: fn;
}
/**
 * default ExpandIcon for BaseTable
 */
export default class ExpandIcon extends React.PureComponent<ExpandIconProps> {
    static defaultProps: {
        depth: number;
        indentSize: number;
    };
    static propTypes: {
        expandable: PropTypes.Requireable<boolean>;
        expanded: PropTypes.Requireable<boolean>;
        indentSize: PropTypes.Requireable<number>;
        depth: PropTypes.Requireable<number>;
        onExpand: PropTypes.Requireable<(...args: any[]) => any>;
    };
    constructor(props: Readonly<ExpandIconProps>);
    render(): JSX.Element | null;
    _handleClick(e: any): void;
}
