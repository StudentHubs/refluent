import * as React from 'react';

import createCache from './cache';
import { clearUndef } from './utils';

export default function(YieldComp) {
  return C => {
    if (!C) return YieldComp;

    class YieldNext extends React.PureComponent {
      render() {
        return React.createElement(C, this.props);
      }
    }
    return class Yield extends React.Component<any> {
      state = { cache: createCache(), next: null };
      static getDerivedStateFromProps(props, state) {
        return {
          next: Object.assign(
            (extra, cache) => {
              if (!extra) return React.createElement(C, props);
              return React.createElement(
                YieldNext,
                state.cache(
                  clearUndef({
                    ...(typeof extra === 'function' ? extra(props) : extra),
                    next: props.next,
                  }),
                  cache,
                ),
              ) as any;
            },
            { noCache: true },
          ),
        };
      }
      render() {
        return React.createElement(YieldComp, {
          ...this.props,
          next: this.state.next,
        });
      }
    };
  };
}
