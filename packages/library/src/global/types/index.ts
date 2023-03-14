import { VNode } from "preact";

export type SwissAttrs = Record<string, unknown>;

type Keys<Attrs extends SwissAttrs> = {
  [K in keyof Attrs]: Attrs[K] extends (...args: unknown[]) => unknown
    ? never
    : K;
}[keyof Attrs];

export type GetAttrs<Attrs extends SwissAttrs> = Pick<
  {
    [K in keyof Attrs]: Attrs[K] extends string ? Attrs[K] : string;
  },
  Keys<Attrs>
>;

export type SwissTree<Attrs extends SwissAttrs> = (args: {
  attrs: GetAttrs<Attrs>;
  error: null | Error;
}) => VNode;

export type SwissEvent<AttrKeys> = AttrKeys extends `on${infer E}` ? E : never;

export type DispatchEventPayload = Record<string, unknown>;

export type DispatchEventOptions = Record<string, unknown>;
