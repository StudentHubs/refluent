export declare const isObject: (x: any) => boolean;
export declare const clearUndef: (obj: any, keys?: string[]) => {};
export declare const shallowEqual: (a: any, b: any) => boolean;
export declare const isPlain: (a: any) => boolean;
export declare const select: (selector: any, props: any, pushed?: any) => any;
export declare const Root: ({ next, children, ...props }: {
    [x: string]: any;
    next: any;
    children: any;
}) => any;
