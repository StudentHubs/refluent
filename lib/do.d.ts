import * as React from 'react';
export default function (...selectors: any[]): (C?: any) => {
    new (props: Readonly<{}>): {
        state: {
            maps: {};
            cache: (obj: any, full?: boolean | undefined) => {
                [key: string]: any;
            };
            pushed: {} | null;
        };
        render(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    new (props: {}, context?: any): {
        state: {
            maps: {};
            cache: (obj: any, full?: boolean | undefined) => {
                [key: string]: any;
            };
            pushed: {} | null;
        };
        render(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<{}>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps(props: any, state: any): any;
} | {
    new (props: any): {
        componentDidMount(): void;
        componentDidUpdate(): void;
        componentWillUnmount(): void;
        render(): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<any>;
        state: Readonly<any>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    getDerivedStateFromProps(props: any, { runner, state }: {
        runner: any;
        state: any;
    }): {
        state: any;
    } | null;
};
