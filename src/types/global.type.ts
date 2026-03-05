export type Flatten<T> = T extends string
  ? T
  : T extends (...args: unknown[]) => unknown
    ? never
    : T extends object
      ? Flatten<T[keyof T]>
      : never;