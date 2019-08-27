import * as React from 'react';

export interface IExpandIconProps {
  expandable?: boolean;
  expanded?: boolean;
  indentSize?: number;
  depth?: number;
  onExpand?: (...args: any[]) => any;
}

/**
 * default ExpandIcon for BaseTable
 */
declare class ExpandIcon extends React.PureComponent<IExpandIconProps> {
  static defaultProps: {
    depth: number;
    indentSize: number;
  };
  constructor(props: Readonly<IExpandIconProps>);
  render(): JSX.Element | null;
  _handleClick(e: React.MouseEvent): void;
}

export default ExpandIcon;
