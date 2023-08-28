import type {Color, Object3D} from "three";

export type BlockOptions = {
    width: number;
    height: number;
    padding?: number;
    fontColor?: Color;
    fontOpacity?: number;
    fontFamily?: string;
    fontTexture?: string;
    backgroundColor?: Color;
    backgroundOpacity?: number;
    borderRadius?: number | [topLeft: number, topRight: number, bottomRight: number, bottomLeft: number];
    justifyContent: "start" | "end" | "center";
}

export declare class Block extends Object3D {
    constructor(options: BlockOptions);
}

export type TextOptions = {
    content?: string;
    fontSize?: number;
    fontColor?: Color;
    fontOpacity?: number;
}

export declare class Text extends Object3D {
    constructor(options: TextOptions);

    set(options: TextOptions): void;
}

export type InlineBlockOptions = {
}

export declare class InlineBlock extends Object3D {
    constructor(options: InlineBlockOptions);
}

export type KeyboardOptions = {
}

export declare class Keyboard extends Object3D {
    constructor(options: KeyboardOptions);
}

export declare namespace FontLibrary {
    export function setFontFamily(): void;

    export function setFontTexture(): void;

    export function getFontOf(): void;

    // @todo fix type
    export function addFont(...args: any[]): any;
}

export declare function update(): void;

type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
interface RefObject<T> {
    readonly current: T | null;
}
type Ref<T> = RefCallback<T> | RefObject<T> | null;
type Key = string | number;

interface Props<T, P> extends P {
    children?: any;
    ref?: Ref<T>;
    key?: Key;
    args?: [P];
}

interface ThreeMeshUIElements {
  block: Props<Block, BlockOptions>;
  text: Props<Text, TextOptions>;
}

declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeMeshUIElements {
        }
    }
}
