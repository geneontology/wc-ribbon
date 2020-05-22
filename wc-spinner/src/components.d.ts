/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface WcSpinner {
        /**
          * Define the color of the spinner. This parameter is optional and will override any declared CSS variable
         */
        "spinnerColor": string;
        /**
          * Define the size of the spinner (TO DO).
         */
        "spinnerSize": number;
        /**
          * Define the style of the spinner. Accepted values: default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart
         */
        "spinnerStyle": string;
    }
}
declare global {
    interface HTMLWcSpinnerElement extends Components.WcSpinner, HTMLStencilElement {
    }
    var HTMLWcSpinnerElement: {
        prototype: HTMLWcSpinnerElement;
        new (): HTMLWcSpinnerElement;
    };
    interface HTMLElementTagNameMap {
        "wc-spinner": HTMLWcSpinnerElement;
    }
}
declare namespace LocalJSX {
    interface WcSpinner {
        /**
          * Define the color of the spinner. This parameter is optional and will override any declared CSS variable
         */
        "spinnerColor"?: string;
        /**
          * Define the size of the spinner (TO DO).
         */
        "spinnerSize"?: number;
        /**
          * Define the style of the spinner. Accepted values: default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart
         */
        "spinnerStyle"?: string;
    }
    interface IntrinsicElements {
        "wc-spinner": WcSpinner;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "wc-spinner": LocalJSX.WcSpinner & JSXBase.HTMLAttributes<HTMLWcSpinnerElement>;
        }
    }
}