import { Character, Icon } from "./ICharacter.ts";
import { IButton, IContainer, IPanel, ILabel, IInput, ICheckbox } from "./ICommonElements.ts";
import type { IElement } from "./IElement.ts";

type CustomElementConstructor = () => IElement;

const custom_element_constructors: Record<string, CustomElementConstructor> = {};


custom_element_constructors["character"] = () => new Character();
custom_element_constructors["icon"] = () => new Icon();
custom_element_constructors["button"] = () => new IButton();
custom_element_constructors["container"] = () => new IContainer();
custom_element_constructors["panel"] = () => new IPanel();
custom_element_constructors["label"] = () => new ILabel();
custom_element_constructors["input"] = () => new IInput();
custom_element_constructors["checkbox"] = () => new ICheckbox();

export function CreateCustomElement(tag: string): IElement | null {
    const constructor = custom_element_constructors[tag];
    return constructor ? constructor() : null;
}

export function IsCustomElement(tag: string): boolean {
    return (typeof custom_element_constructors[tag]) === "function";
}

export function RegisterCustomElement(tag: string, constructor: CustomElementConstructor): void {
    custom_element_constructors[tag] = constructor;
}
