export default class StyleColorProperty extends SubStyleProperty {
    constructor(propertyId: any, defaultValue: any);
    /**
     * @type {Color}
     * @protected
     */
    protected _value: Color;
    output: (out: any) => void;
    /**
     * @override
     */
    override computeOutputValue(element: any): void;
}
import SubStyleProperty from "./SubStyleProperty";
import { Color } from "three/src/math/Color";
