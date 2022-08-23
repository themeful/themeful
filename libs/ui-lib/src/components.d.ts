/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AliasTokenFormData, ComponentItemBundle, ComponentListBundle, DesignTokenFormAction, DesignTokenFormData, DesignTokenSplitFormData, ExtendedStyle, ExtendedStyleGuides, FormIntegrationActions, FormIntegrations, KeyValues, StyleFormAction, StyleFormData, StyleGuideFormAction, StyleGuideFormData, ThemeBundle, ThemeFormAction, ThemeFormData, ThemeValueFormAction, ThemeValueFormData, Toast } from "@typings";
import { ButtonKind } from "./components/button/interfaces";
import { Observable } from "rxjs";
import { MenuItem } from "./components/menu/menu.component";
import { NavigationItem } from "./components/navigation/navigation.component";
export namespace Components {
    interface TfAliasTokenForm {
        /**
          * Data for the form
         */
        "formData": AliasTokenFormData;
    }
    interface TfButton {
        /**
          * Active state
         */
        "active": boolean;
        /**
          * Disabled state
         */
        "disabled": boolean;
        /**
          * Button kind
         */
        "kind": ButtonKind;
        /**
          * Button size
         */
        "size"?: 'small' | 'large' | 'icon';
        /**
          * Button type
         */
        "type": string;
    }
    interface TfColorInput {
        /**
          * Changed value
         */
        "dirty": () => Promise<boolean>;
        /**
          * Input label
         */
        "label": string;
        /**
          * Required input
         */
        "required": boolean;
        /**
          * Validate value
         */
        "validate": () => Promise<boolean>;
        /**
          * Input value
         */
        "value": string;
    }
    interface TfComponentItem {
        /**
          * Component Item Bundle
         */
        "componentBundle$": Observable<ComponentItemBundle>;
        /**
          * Component UUID
         */
        "uuid": string;
    }
    interface TfComponentList {
        /**
          * Component List Bundle
         */
        "componentListBundle$": Observable<ComponentListBundle>;
    }
    interface TfDesignTokenForm {
        /**
          * Data for the form
         */
        "formData": DesignTokenFormData;
    }
    interface TfDesignTokenSplitForm {
        /**
          * Data for the form
         */
        "formData": DesignTokenSplitFormData;
    }
    interface TfFormIntegration {
        /**
          * FormData
         */
        "formData$": Subject<FormIntegrations>;
    }
    interface TfIcon {
        /**
          * The icon name
         */
        "icon": string;
        /**
          * The icon size
         */
        "size"?: 'small' | 'large';
    }
    interface TfMenu {
        /**
          * Items
         */
        "items": MenuItem[];
    }
    interface TfMultiSelectInput {
        /**
          * Changed value
         */
        "dirty": () => Promise<boolean>;
        /**
          * Input suggest items
         */
        "items": string[];
        /**
          * Input label
         */
        "label"?: string;
        /**
          * Max input
         */
        "maxLength": number;
        /**
          * Min input
         */
        "minLength": number;
        /**
          * Required input
         */
        "required": boolean;
        /**
          * Input type
         */
        "type": string;
        /**
          * Validate value
         */
        "validate": () => Promise<boolean>;
        /**
          * Input value
         */
        "value": string[];
    }
    interface TfNavigation {
        /**
          * Active state
         */
        "active": string;
        /**
          * Items
         */
        "items": NavigationItem[];
        /**
          * Navigation size
         */
        "size": 'small' | 'large';
    }
    interface TfOverlay {
        /**
          * Overlay visiblity
         */
        "show": boolean;
    }
    interface TfProperty {
        /**
          * The extendedStyle
         */
        "extendedStyle": ExtendedStyle;
        /**
          * Show group
         */
        "showGroup"?: boolean | undefined;
    }
    interface TfSelectInput {
        /**
          * Changed value
         */
        "dirty": () => Promise<boolean>;
        /**
          * Disabled input
         */
        "disabled": boolean;
        /**
          * Input suggest items
         */
        "items": KeyValues;
        /**
          * Input label
         */
        "label": string;
        /**
          * Required input
         */
        "required": boolean;
        /**
          * Input type
         */
        "type": string;
        /**
          * Validate value
         */
        "validate": () => Promise<boolean>;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfStyleForm {
        /**
          * Data for the form
         */
        "formData": StyleFormData;
    }
    interface TfStyleGuideDetails {
        /**
          * Style Guide Slug
         */
        "slug": string;
        /**
          * Style Guides
         */
        "styleGuides$": Observable<ExtendedStyleGuides>;
    }
    interface TfStyleGuideDuplicateForm {
        /**
          * Data for the form
         */
        "formData": StyleGuideFormData;
    }
    interface TfStyleGuideForm {
        /**
          * Data for the form
         */
        "formData": StyleGuideFormData;
    }
    interface TfStyleGuides {
        /**
          * Style Guides
         */
        "styleGuides$": Observable<ExtendedStyleGuides>;
    }
    interface TfSuggestInput {
        /**
          * Changed value
         */
        "dirty": () => Promise<boolean>;
        /**
          * Disabled input
         */
        "disabled": boolean;
        /**
          * Input suggest items
         */
        "items": string[];
        /**
          * Input label
         */
        "label": string;
        /**
          * Max input
         */
        "maxLength": number;
        /**
          * Min input
         */
        "minLength": number;
        /**
          * Required input
         */
        "required": boolean;
        /**
          * Validate value
         */
        "validate": () => Promise<boolean>;
        /**
          * validation function
         */
        "validation"?: (input: string | number) => string | null;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfTextInput {
        /**
          * Changed value
         */
        "dirty": () => Promise<boolean>;
        /**
          * Disabled input
         */
        "disabled": boolean;
        /**
          * Input label
         */
        "label": string;
        /**
          * Max input
         */
        "maxLength": number;
        /**
          * Min input
         */
        "minLength": number;
        /**
          * Required input
         */
        "required": boolean;
        /**
          * Input type
         */
        "type": string;
        /**
          * Validate value
         */
        "validate": () => Promise<boolean>;
        /**
          * validation function
         */
        "validation"?: (value: string | number) => string | null;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfThemeDuplicateForm {
        /**
          * Data for the form
         */
        "formData": ThemeFormData;
    }
    interface TfThemeForm {
        /**
          * Data for the form
         */
        "formData": ThemeFormData;
    }
    interface TfThemeValueForm {
        /**
          * Data for the form
         */
        "formData": ThemeValueFormData;
    }
    interface TfThemes {
        /**
          * Style Guides
         */
        "themeBundle$": Observable<ThemeBundle>;
    }
    interface TfToast {
        /**
          * Toast msg
         */
        "msg$": Observable<Toast>;
    }
}
export interface TfAliasTokenFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfAliasTokenFormElement;
}
export interface TfColorInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfColorInputElement;
}
export interface TfComponentItemCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfComponentItemElement;
}
export interface TfComponentListCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfComponentListElement;
}
export interface TfDesignTokenFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfDesignTokenFormElement;
}
export interface TfDesignTokenSplitFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfDesignTokenSplitFormElement;
}
export interface TfFormIntegrationCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfFormIntegrationElement;
}
export interface TfMenuCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfMenuElement;
}
export interface TfMultiSelectInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfMultiSelectInputElement;
}
export interface TfNavigationCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfNavigationElement;
}
export interface TfOverlayCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfOverlayElement;
}
export interface TfPropertyCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfPropertyElement;
}
export interface TfSelectInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfSelectInputElement;
}
export interface TfStyleFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfStyleFormElement;
}
export interface TfStyleGuideDetailsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfStyleGuideDetailsElement;
}
export interface TfStyleGuideDuplicateFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfStyleGuideDuplicateFormElement;
}
export interface TfStyleGuideFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfStyleGuideFormElement;
}
export interface TfStyleGuidesCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfStyleGuidesElement;
}
export interface TfSuggestInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfSuggestInputElement;
}
export interface TfTextInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfTextInputElement;
}
export interface TfThemeDuplicateFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfThemeDuplicateFormElement;
}
export interface TfThemeFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfThemeFormElement;
}
export interface TfThemeValueFormCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfThemeValueFormElement;
}
export interface TfThemesCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfThemesElement;
}
export interface TfToastCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTfToastElement;
}
declare global {
    interface HTMLTfAliasTokenFormElement extends Components.TfAliasTokenForm, HTMLStencilElement {
    }
    var HTMLTfAliasTokenFormElement: {
        prototype: HTMLTfAliasTokenFormElement;
        new (): HTMLTfAliasTokenFormElement;
    };
    interface HTMLTfButtonElement extends Components.TfButton, HTMLStencilElement {
    }
    var HTMLTfButtonElement: {
        prototype: HTMLTfButtonElement;
        new (): HTMLTfButtonElement;
    };
    interface HTMLTfColorInputElement extends Components.TfColorInput, HTMLStencilElement {
    }
    var HTMLTfColorInputElement: {
        prototype: HTMLTfColorInputElement;
        new (): HTMLTfColorInputElement;
    };
    interface HTMLTfComponentItemElement extends Components.TfComponentItem, HTMLStencilElement {
    }
    var HTMLTfComponentItemElement: {
        prototype: HTMLTfComponentItemElement;
        new (): HTMLTfComponentItemElement;
    };
    interface HTMLTfComponentListElement extends Components.TfComponentList, HTMLStencilElement {
    }
    var HTMLTfComponentListElement: {
        prototype: HTMLTfComponentListElement;
        new (): HTMLTfComponentListElement;
    };
    interface HTMLTfDesignTokenFormElement extends Components.TfDesignTokenForm, HTMLStencilElement {
    }
    var HTMLTfDesignTokenFormElement: {
        prototype: HTMLTfDesignTokenFormElement;
        new (): HTMLTfDesignTokenFormElement;
    };
    interface HTMLTfDesignTokenSplitFormElement extends Components.TfDesignTokenSplitForm, HTMLStencilElement {
    }
    var HTMLTfDesignTokenSplitFormElement: {
        prototype: HTMLTfDesignTokenSplitFormElement;
        new (): HTMLTfDesignTokenSplitFormElement;
    };
    interface HTMLTfFormIntegrationElement extends Components.TfFormIntegration, HTMLStencilElement {
    }
    var HTMLTfFormIntegrationElement: {
        prototype: HTMLTfFormIntegrationElement;
        new (): HTMLTfFormIntegrationElement;
    };
    interface HTMLTfIconElement extends Components.TfIcon, HTMLStencilElement {
    }
    var HTMLTfIconElement: {
        prototype: HTMLTfIconElement;
        new (): HTMLTfIconElement;
    };
    interface HTMLTfMenuElement extends Components.TfMenu, HTMLStencilElement {
    }
    var HTMLTfMenuElement: {
        prototype: HTMLTfMenuElement;
        new (): HTMLTfMenuElement;
    };
    interface HTMLTfMultiSelectInputElement extends Components.TfMultiSelectInput, HTMLStencilElement {
    }
    var HTMLTfMultiSelectInputElement: {
        prototype: HTMLTfMultiSelectInputElement;
        new (): HTMLTfMultiSelectInputElement;
    };
    interface HTMLTfNavigationElement extends Components.TfNavigation, HTMLStencilElement {
    }
    var HTMLTfNavigationElement: {
        prototype: HTMLTfNavigationElement;
        new (): HTMLTfNavigationElement;
    };
    interface HTMLTfOverlayElement extends Components.TfOverlay, HTMLStencilElement {
    }
    var HTMLTfOverlayElement: {
        prototype: HTMLTfOverlayElement;
        new (): HTMLTfOverlayElement;
    };
    interface HTMLTfPropertyElement extends Components.TfProperty, HTMLStencilElement {
    }
    var HTMLTfPropertyElement: {
        prototype: HTMLTfPropertyElement;
        new (): HTMLTfPropertyElement;
    };
    interface HTMLTfSelectInputElement extends Components.TfSelectInput, HTMLStencilElement {
    }
    var HTMLTfSelectInputElement: {
        prototype: HTMLTfSelectInputElement;
        new (): HTMLTfSelectInputElement;
    };
    interface HTMLTfStyleFormElement extends Components.TfStyleForm, HTMLStencilElement {
    }
    var HTMLTfStyleFormElement: {
        prototype: HTMLTfStyleFormElement;
        new (): HTMLTfStyleFormElement;
    };
    interface HTMLTfStyleGuideDetailsElement extends Components.TfStyleGuideDetails, HTMLStencilElement {
    }
    var HTMLTfStyleGuideDetailsElement: {
        prototype: HTMLTfStyleGuideDetailsElement;
        new (): HTMLTfStyleGuideDetailsElement;
    };
    interface HTMLTfStyleGuideDuplicateFormElement extends Components.TfStyleGuideDuplicateForm, HTMLStencilElement {
    }
    var HTMLTfStyleGuideDuplicateFormElement: {
        prototype: HTMLTfStyleGuideDuplicateFormElement;
        new (): HTMLTfStyleGuideDuplicateFormElement;
    };
    interface HTMLTfStyleGuideFormElement extends Components.TfStyleGuideForm, HTMLStencilElement {
    }
    var HTMLTfStyleGuideFormElement: {
        prototype: HTMLTfStyleGuideFormElement;
        new (): HTMLTfStyleGuideFormElement;
    };
    interface HTMLTfStyleGuidesElement extends Components.TfStyleGuides, HTMLStencilElement {
    }
    var HTMLTfStyleGuidesElement: {
        prototype: HTMLTfStyleGuidesElement;
        new (): HTMLTfStyleGuidesElement;
    };
    interface HTMLTfSuggestInputElement extends Components.TfSuggestInput, HTMLStencilElement {
    }
    var HTMLTfSuggestInputElement: {
        prototype: HTMLTfSuggestInputElement;
        new (): HTMLTfSuggestInputElement;
    };
    interface HTMLTfTextInputElement extends Components.TfTextInput, HTMLStencilElement {
    }
    var HTMLTfTextInputElement: {
        prototype: HTMLTfTextInputElement;
        new (): HTMLTfTextInputElement;
    };
    interface HTMLTfThemeDuplicateFormElement extends Components.TfThemeDuplicateForm, HTMLStencilElement {
    }
    var HTMLTfThemeDuplicateFormElement: {
        prototype: HTMLTfThemeDuplicateFormElement;
        new (): HTMLTfThemeDuplicateFormElement;
    };
    interface HTMLTfThemeFormElement extends Components.TfThemeForm, HTMLStencilElement {
    }
    var HTMLTfThemeFormElement: {
        prototype: HTMLTfThemeFormElement;
        new (): HTMLTfThemeFormElement;
    };
    interface HTMLTfThemeValueFormElement extends Components.TfThemeValueForm, HTMLStencilElement {
    }
    var HTMLTfThemeValueFormElement: {
        prototype: HTMLTfThemeValueFormElement;
        new (): HTMLTfThemeValueFormElement;
    };
    interface HTMLTfThemesElement extends Components.TfThemes, HTMLStencilElement {
    }
    var HTMLTfThemesElement: {
        prototype: HTMLTfThemesElement;
        new (): HTMLTfThemesElement;
    };
    interface HTMLTfToastElement extends Components.TfToast, HTMLStencilElement {
    }
    var HTMLTfToastElement: {
        prototype: HTMLTfToastElement;
        new (): HTMLTfToastElement;
    };
    interface HTMLElementTagNameMap {
        "tf-alias-token-form": HTMLTfAliasTokenFormElement;
        "tf-button": HTMLTfButtonElement;
        "tf-color-input": HTMLTfColorInputElement;
        "tf-component-item": HTMLTfComponentItemElement;
        "tf-component-list": HTMLTfComponentListElement;
        "tf-design-token-form": HTMLTfDesignTokenFormElement;
        "tf-design-token-split-form": HTMLTfDesignTokenSplitFormElement;
        "tf-form-integration": HTMLTfFormIntegrationElement;
        "tf-icon": HTMLTfIconElement;
        "tf-menu": HTMLTfMenuElement;
        "tf-multi-select-input": HTMLTfMultiSelectInputElement;
        "tf-navigation": HTMLTfNavigationElement;
        "tf-overlay": HTMLTfOverlayElement;
        "tf-property": HTMLTfPropertyElement;
        "tf-select-input": HTMLTfSelectInputElement;
        "tf-style-form": HTMLTfStyleFormElement;
        "tf-style-guide-details": HTMLTfStyleGuideDetailsElement;
        "tf-style-guide-duplicate-form": HTMLTfStyleGuideDuplicateFormElement;
        "tf-style-guide-form": HTMLTfStyleGuideFormElement;
        "tf-style-guides": HTMLTfStyleGuidesElement;
        "tf-suggest-input": HTMLTfSuggestInputElement;
        "tf-text-input": HTMLTfTextInputElement;
        "tf-theme-duplicate-form": HTMLTfThemeDuplicateFormElement;
        "tf-theme-form": HTMLTfThemeFormElement;
        "tf-theme-value-form": HTMLTfThemeValueFormElement;
        "tf-themes": HTMLTfThemesElement;
        "tf-toast": HTMLTfToastElement;
    }
}
declare namespace LocalJSX {
    interface TfAliasTokenForm {
        /**
          * Data for the form
         */
        "formData": AliasTokenFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfAliasTokenFormCustomEvent<DesignTokenFormAction>) => void;
    }
    interface TfButton {
        /**
          * Active state
         */
        "active"?: boolean;
        /**
          * Disabled state
         */
        "disabled"?: boolean;
        /**
          * Button kind
         */
        "kind"?: ButtonKind;
        /**
          * Button size
         */
        "size"?: 'small' | 'large' | 'icon';
        /**
          * Button type
         */
        "type"?: string;
    }
    interface TfColorInput {
        /**
          * Input label
         */
        "label": string;
        /**
          * Input Event
         */
        "onInputChange"?: (event: TfColorInputCustomEvent<any>) => void;
        /**
          * Required input
         */
        "required"?: boolean;
        /**
          * Input value
         */
        "value": string;
    }
    interface TfComponentItem {
        /**
          * Component Item Bundle
         */
        "componentBundle$": Observable<ComponentItemBundle>;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfComponentItemCustomEvent<FormIntegrationActions>) => void;
        /**
          * Component UUID
         */
        "uuid": string;
    }
    interface TfComponentList {
        /**
          * Component List Bundle
         */
        "componentListBundle$": Observable<ComponentListBundle>;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfComponentListCustomEvent<FormIntegrationActions>) => void;
    }
    interface TfDesignTokenForm {
        /**
          * Data for the form
         */
        "formData": DesignTokenFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfDesignTokenFormCustomEvent<DesignTokenFormAction>) => void;
    }
    interface TfDesignTokenSplitForm {
        /**
          * Data for the form
         */
        "formData": DesignTokenSplitFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfDesignTokenSplitFormCustomEvent<DesignTokenFormAction>) => void;
    }
    interface TfFormIntegration {
        /**
          * FormData
         */
        "formData$"?: Subject<FormIntegrations>;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfFormIntegrationCustomEvent<FormIntegrationActions>) => void;
    }
    interface TfIcon {
        /**
          * The icon name
         */
        "icon": string;
        /**
          * The icon size
         */
        "size"?: 'small' | 'large';
    }
    interface TfMenu {
        /**
          * Items
         */
        "items"?: MenuItem[];
        /**
          * Input Event
         */
        "onItemClick"?: (event: TfMenuCustomEvent<any>) => void;
    }
    interface TfMultiSelectInput {
        /**
          * Input suggest items
         */
        "items"?: string[];
        /**
          * Input label
         */
        "label"?: string;
        /**
          * Max input
         */
        "maxLength"?: number;
        /**
          * Min input
         */
        "minLength"?: number;
        /**
          * Input Event
         */
        "onInputChange"?: (event: TfMultiSelectInputCustomEvent<any>) => void;
        /**
          * Required input
         */
        "required"?: boolean;
        /**
          * Input type
         */
        "type"?: string;
        /**
          * Input value
         */
        "value"?: string[];
    }
    interface TfNavigation {
        /**
          * Active state
         */
        "active"?: string;
        /**
          * Items
         */
        "items"?: NavigationItem[];
        /**
          * Input Event
         */
        "onItemClick"?: (event: TfNavigationCustomEvent<any>) => void;
        /**
          * Navigation size
         */
        "size": 'small' | 'large';
    }
    interface TfOverlay {
        /**
          * Event emitted when the item is clicked
         */
        "onClose"?: (event: TfOverlayCustomEvent<any>) => void;
        /**
          * Overlay visiblity
         */
        "show"?: boolean;
    }
    interface TfProperty {
        /**
          * The extendedStyle
         */
        "extendedStyle": ExtendedStyle;
        /**
          * Edit event
         */
        "onEdit"?: (event: TfPropertyCustomEvent<any>) => void;
        /**
          * Show group
         */
        "showGroup"?: boolean | undefined;
    }
    interface TfSelectInput {
        /**
          * Disabled input
         */
        "disabled"?: boolean;
        /**
          * Input suggest items
         */
        "items"?: KeyValues;
        /**
          * Input label
         */
        "label": string;
        /**
          * Input Event
         */
        "onInputChange"?: (event: TfSelectInputCustomEvent<any>) => void;
        /**
          * Required input
         */
        "required"?: boolean;
        /**
          * Input type
         */
        "type"?: string;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfStyleForm {
        /**
          * Data for the form
         */
        "formData": StyleFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfStyleFormCustomEvent<StyleFormAction>) => void;
    }
    interface TfStyleGuideDetails {
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfStyleGuideDetailsCustomEvent<FormIntegrationActions>) => void;
        /**
          * Style Guide Slug
         */
        "slug": string;
        /**
          * Style Guides
         */
        "styleGuides$": Observable<ExtendedStyleGuides>;
    }
    interface TfStyleGuideDuplicateForm {
        /**
          * Data for the form
         */
        "formData": StyleGuideFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfStyleGuideDuplicateFormCustomEvent<StyleGuideFormAction>) => void;
    }
    interface TfStyleGuideForm {
        /**
          * Data for the form
         */
        "formData": StyleGuideFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfStyleGuideFormCustomEvent<StyleGuideFormAction>) => void;
    }
    interface TfStyleGuides {
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfStyleGuidesCustomEvent<FormIntegrationActions>) => void;
        /**
          * Style Guides
         */
        "styleGuides$": Observable<ExtendedStyleGuides>;
    }
    interface TfSuggestInput {
        /**
          * Disabled input
         */
        "disabled"?: boolean;
        /**
          * Input suggest items
         */
        "items"?: string[];
        /**
          * Input label
         */
        "label": string;
        /**
          * Max input
         */
        "maxLength"?: number;
        /**
          * Min input
         */
        "minLength"?: number;
        /**
          * Input Event
         */
        "onInputChange"?: (event: TfSuggestInputCustomEvent<any>) => void;
        /**
          * Required input
         */
        "required"?: boolean;
        /**
          * validation function
         */
        "validation"?: (input: string | number) => string | null;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfTextInput {
        /**
          * Disabled input
         */
        "disabled"?: boolean;
        /**
          * Input label
         */
        "label": string;
        /**
          * Max input
         */
        "maxLength"?: number;
        /**
          * Min input
         */
        "minLength"?: number;
        /**
          * Input Event
         */
        "onInputChange"?: (event: TfTextInputCustomEvent<any>) => void;
        /**
          * Required input
         */
        "required"?: boolean;
        /**
          * Input type
         */
        "type"?: string;
        /**
          * validation function
         */
        "validation"?: (value: string | number) => string | null;
        /**
          * Input value
         */
        "value": string | number;
    }
    interface TfThemeDuplicateForm {
        /**
          * Data for the form
         */
        "formData": ThemeFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfThemeDuplicateFormCustomEvent<ThemeFormAction>) => void;
    }
    interface TfThemeForm {
        /**
          * Data for the form
         */
        "formData": ThemeFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfThemeFormCustomEvent<ThemeFormAction>) => void;
    }
    interface TfThemeValueForm {
        /**
          * Data for the form
         */
        "formData": ThemeValueFormData;
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfThemeValueFormCustomEvent<ThemeValueFormAction>) => void;
    }
    interface TfThemes {
        /**
          * Event emitted when an action is triggered
         */
        "onAction"?: (event: TfThemesCustomEvent<FormIntegrationActions>) => void;
        /**
          * Style Guides
         */
        "themeBundle$": Observable<ThemeBundle>;
    }
    interface TfToast {
        /**
          * Toast msg
         */
        "msg$": Observable<Toast>;
        /**
          * Input Event
         */
        "onState"?: (event: TfToastCustomEvent<any>) => void;
    }
    interface IntrinsicElements {
        "tf-alias-token-form": TfAliasTokenForm;
        "tf-button": TfButton;
        "tf-color-input": TfColorInput;
        "tf-component-item": TfComponentItem;
        "tf-component-list": TfComponentList;
        "tf-design-token-form": TfDesignTokenForm;
        "tf-design-token-split-form": TfDesignTokenSplitForm;
        "tf-form-integration": TfFormIntegration;
        "tf-icon": TfIcon;
        "tf-menu": TfMenu;
        "tf-multi-select-input": TfMultiSelectInput;
        "tf-navigation": TfNavigation;
        "tf-overlay": TfOverlay;
        "tf-property": TfProperty;
        "tf-select-input": TfSelectInput;
        "tf-style-form": TfStyleForm;
        "tf-style-guide-details": TfStyleGuideDetails;
        "tf-style-guide-duplicate-form": TfStyleGuideDuplicateForm;
        "tf-style-guide-form": TfStyleGuideForm;
        "tf-style-guides": TfStyleGuides;
        "tf-suggest-input": TfSuggestInput;
        "tf-text-input": TfTextInput;
        "tf-theme-duplicate-form": TfThemeDuplicateForm;
        "tf-theme-form": TfThemeForm;
        "tf-theme-value-form": TfThemeValueForm;
        "tf-themes": TfThemes;
        "tf-toast": TfToast;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "tf-alias-token-form": LocalJSX.TfAliasTokenForm & JSXBase.HTMLAttributes<HTMLTfAliasTokenFormElement>;
            "tf-button": LocalJSX.TfButton & JSXBase.HTMLAttributes<HTMLTfButtonElement>;
            "tf-color-input": LocalJSX.TfColorInput & JSXBase.HTMLAttributes<HTMLTfColorInputElement>;
            "tf-component-item": LocalJSX.TfComponentItem & JSXBase.HTMLAttributes<HTMLTfComponentItemElement>;
            "tf-component-list": LocalJSX.TfComponentList & JSXBase.HTMLAttributes<HTMLTfComponentListElement>;
            "tf-design-token-form": LocalJSX.TfDesignTokenForm & JSXBase.HTMLAttributes<HTMLTfDesignTokenFormElement>;
            "tf-design-token-split-form": LocalJSX.TfDesignTokenSplitForm & JSXBase.HTMLAttributes<HTMLTfDesignTokenSplitFormElement>;
            "tf-form-integration": LocalJSX.TfFormIntegration & JSXBase.HTMLAttributes<HTMLTfFormIntegrationElement>;
            "tf-icon": LocalJSX.TfIcon & JSXBase.HTMLAttributes<HTMLTfIconElement>;
            "tf-menu": LocalJSX.TfMenu & JSXBase.HTMLAttributes<HTMLTfMenuElement>;
            "tf-multi-select-input": LocalJSX.TfMultiSelectInput & JSXBase.HTMLAttributes<HTMLTfMultiSelectInputElement>;
            "tf-navigation": LocalJSX.TfNavigation & JSXBase.HTMLAttributes<HTMLTfNavigationElement>;
            "tf-overlay": LocalJSX.TfOverlay & JSXBase.HTMLAttributes<HTMLTfOverlayElement>;
            "tf-property": LocalJSX.TfProperty & JSXBase.HTMLAttributes<HTMLTfPropertyElement>;
            "tf-select-input": LocalJSX.TfSelectInput & JSXBase.HTMLAttributes<HTMLTfSelectInputElement>;
            "tf-style-form": LocalJSX.TfStyleForm & JSXBase.HTMLAttributes<HTMLTfStyleFormElement>;
            "tf-style-guide-details": LocalJSX.TfStyleGuideDetails & JSXBase.HTMLAttributes<HTMLTfStyleGuideDetailsElement>;
            "tf-style-guide-duplicate-form": LocalJSX.TfStyleGuideDuplicateForm & JSXBase.HTMLAttributes<HTMLTfStyleGuideDuplicateFormElement>;
            "tf-style-guide-form": LocalJSX.TfStyleGuideForm & JSXBase.HTMLAttributes<HTMLTfStyleGuideFormElement>;
            "tf-style-guides": LocalJSX.TfStyleGuides & JSXBase.HTMLAttributes<HTMLTfStyleGuidesElement>;
            "tf-suggest-input": LocalJSX.TfSuggestInput & JSXBase.HTMLAttributes<HTMLTfSuggestInputElement>;
            "tf-text-input": LocalJSX.TfTextInput & JSXBase.HTMLAttributes<HTMLTfTextInputElement>;
            "tf-theme-duplicate-form": LocalJSX.TfThemeDuplicateForm & JSXBase.HTMLAttributes<HTMLTfThemeDuplicateFormElement>;
            "tf-theme-form": LocalJSX.TfThemeForm & JSXBase.HTMLAttributes<HTMLTfThemeFormElement>;
            "tf-theme-value-form": LocalJSX.TfThemeValueForm & JSXBase.HTMLAttributes<HTMLTfThemeValueFormElement>;
            "tf-themes": LocalJSX.TfThemes & JSXBase.HTMLAttributes<HTMLTfThemesElement>;
            "tf-toast": LocalJSX.TfToast & JSXBase.HTMLAttributes<HTMLTfToastElement>;
        }
    }
}
