import { Character, Icon } from "./ICharacter.js";

const custom_element_constructors = {};

custom_element_constructors["character"] = () => new Character();
custom_element_constructors["icon"] = () => new Icon();

export function CreateCustomElement(tag) {
    const constructor = custom_element_constructors[tag];
    return constructor ? constructor() : null;
}

export function IsCustomElement(tag) {
    return (typeof custom_element_constructors[tag]) === "function";
}

export function RegisterCustomElement(tag, constructor) {
    custom_element_constructors[tag] = constructor;
}