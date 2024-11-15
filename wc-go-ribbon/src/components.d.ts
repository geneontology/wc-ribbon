/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface WcGoRibbon {
        /**
          * add a cell at the beginning of each row/subject to show all annotations
         */
        "addCellAll": boolean;
        "annotationLabels": string;
        "baseApiUrl": string;
        /**
          * false = show a gradient of colors to indicate the value of a cell true = show only two colors (minColor; maxColor) to indicate the values of a cell
         */
        "binaryColor": boolean;
        /**
          * 0 = Normal 1 = Bold
         */
        "categoryAllStyle": any;
        /**
          * Override of the category case 0 (default) = unchanged 1 = to lower case 2 = to upper case
         */
        "categoryCase": any;
        /**
          * 0 = Normal 1 = Bold
         */
        "categoryOtherStyle": any;
        "classLabels": string;
        /**
          * Which value to base the cell color on 0 = class count 1 = annotation count
         */
        "colorBy": any;
        /**
          * if provided, will override any value provided in subjects and subset
         */
        "data": string;
        "excludePB": boolean;
        /**
          * Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx" Note: if value is "", remove any filtering
         */
        "filterBy": string;
        "filterCrossAspect": boolean;
        "filterReference": string;
        /**
          * If true, the ribbon will fire an event if a user click an empty cell If false, the ribbon will not fire the event on an empty cell Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
         */
        "fireEventOnEmptyCells": boolean;
        "groupBaseUrl": string;
        /**
          * Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping
         */
        "groupBy": string;
        "groupClickable": boolean;
        "groupMaxLabelSize": number;
        "groupNewTab": boolean;
        /**
          * Used to hide specific column of the table
         */
        "hideColumns": string;
        "maxColor": string;
        "maxHeatLevel": number;
        "minColor": string;
        /**
          * This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering
         */
        "orderBy": string;
        /**
          * If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected
         */
        "selected": any;
        /**
          * Click handling of a cell. 0 = select only the cell (1 subject, 1 group) 1 = select the whole column (all subjects, 1 group)
         */
        "selectionMode": any;
        /**
          * add a cell at the end of each row/subject to represent all annotations not mapped to a specific term
         */
        "showOtherGroup": boolean;
        "subjectBaseUrl": string;
        "subjectOpenNewTab": boolean;
        /**
          * Position the subject label of each row 0 = None 1 = Left 2 = Right 3 = Bottom
         */
        "subjectPosition": any;
        "subjectUseTaxonIcon": boolean;
        /**
          * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
         */
        "subjects": string;
        "subset": string;
    }
}
declare global {
    interface HTMLWcGoRibbonElement extends Components.WcGoRibbon, HTMLStencilElement {
    }
    var HTMLWcGoRibbonElement: {
        prototype: HTMLWcGoRibbonElement;
        new (): HTMLWcGoRibbonElement;
    };
    interface HTMLElementTagNameMap {
        "wc-go-ribbon": HTMLWcGoRibbonElement;
    }
}
declare namespace LocalJSX {
    interface WcGoRibbon {
        /**
          * add a cell at the beginning of each row/subject to show all annotations
         */
        "addCellAll"?: boolean;
        "annotationLabels"?: string;
        "baseApiUrl"?: string;
        /**
          * false = show a gradient of colors to indicate the value of a cell true = show only two colors (minColor; maxColor) to indicate the values of a cell
         */
        "binaryColor"?: boolean;
        /**
          * 0 = Normal 1 = Bold
         */
        "categoryAllStyle"?: any;
        /**
          * Override of the category case 0 (default) = unchanged 1 = to lower case 2 = to upper case
         */
        "categoryCase"?: any;
        /**
          * 0 = Normal 1 = Bold
         */
        "categoryOtherStyle"?: any;
        "classLabels"?: string;
        /**
          * Which value to base the cell color on 0 = class count 1 = annotation count
         */
        "colorBy"?: any;
        /**
          * if provided, will override any value provided in subjects and subset
         */
        "data"?: string;
        "excludePB"?: boolean;
        /**
          * Filter rows based on the presence of one or more values in a given column The filtering will be based on cell label or id Example: filter-by="evidence:ISS,ISO or multi-step filters: filter-by:evidence:ISS,ISO;term:xxx" Note: if value is "", remove any filtering
         */
        "filterBy"?: string;
        "filterCrossAspect"?: boolean;
        "filterReference"?: string;
        /**
          * If true, the ribbon will fire an event if a user click an empty cell If false, the ribbon will not fire the event on an empty cell Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
         */
        "fireEventOnEmptyCells"?: boolean;
        "groupBaseUrl"?: string;
        /**
          * Using this parameter, the table rows can bee grouped based on column ids A multiple step grouping is possible by using a ";" between groups The grouping applies before the ordering Example: hid-1,hid-3 OR hid-1,hid-3;hid-2 Note: if value is "", remove any grouping
         */
        "groupBy"?: string;
        "groupClickable"?: boolean;
        "groupMaxLabelSize"?: number;
        "groupNewTab"?: boolean;
        /**
          * Used to hide specific column of the table
         */
        "hideColumns"?: string;
        "maxColor"?: string;
        "maxHeatLevel"?: number;
        "minColor"?: string;
        /**
          * This is used to sort the table depending of a column The column cells must be single values The ordering applies after the grouping Note: if value is "", remove any ordering
         */
        "orderBy"?: string;
        /**
          * If no value is provided, the ribbon will load without any group selected. If a value is provided, the ribbon will show the requested group as selected The value should be the id of the group to be selected
         */
        "selected"?: any;
        /**
          * Click handling of a cell. 0 = select only the cell (1 subject, 1 group) 1 = select the whole column (all subjects, 1 group)
         */
        "selectionMode"?: any;
        /**
          * add a cell at the end of each row/subject to represent all annotations not mapped to a specific term
         */
        "showOtherGroup"?: boolean;
        "subjectBaseUrl"?: string;
        "subjectOpenNewTab"?: boolean;
        /**
          * Position the subject label of each row 0 = None 1 = Left 2 = Right 3 = Bottom
         */
        "subjectPosition"?: any;
        "subjectUseTaxonIcon"?: boolean;
        /**
          * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
         */
        "subjects"?: string;
        "subset"?: string;
    }
    interface IntrinsicElements {
        "wc-go-ribbon": WcGoRibbon;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "wc-go-ribbon": LocalJSX.WcGoRibbon & JSXBase.HTMLAttributes<HTMLWcGoRibbonElement>;
        }
    }
}
