import { Component, h, Prop, Watch } from '@stencil/core';

import { COLOR_BY, POSITION, SELECTION, FONT_CASE, FONT_STYLE } from '@geneontology/wc-ribbon-strips/dist/collection/globals/enums.js';

import { RibbonStrips }  from '@geneontology/wc-ribbon-strips/dist'


// import { bioLinkToTable } from '../../globals/utils';

@Component({
  tag: 'wc-go-ribbon',
  styleUrl: './go-ribbon.css',
  shadow: false
})
export class GORibbon {

    ribbonStrips : RibbonStrips;

    @Prop() baseApiUrl = "http://api.geneontology.org/api/ontology/ribbon/";

    @Prop() subjectBaseUrl: string = "http://amigo.geneontology.org/amigo/gene_product/";
    @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

    @Prop() subset: string = "goslim_agr";

    /**
     * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
     */
    @Prop() subjects: string = undefined;

    @Prop() classLabels = "term,terms";
    @Prop() annotationLabels = "annotation,annotations";

    /**
     * Which value to base the cell color on
     * 0 = class count
     * 1 = annotation count
     */
    @Prop() colorBy = COLOR_BY.ANNOTATION_COUNT;

    /**
     * false = show a gradient of colors to indicate the value of a cell
     * true = show only two colors (minColor; maxColor) to indicate the values of a cell
     */
    @Prop() binaryColor = false;
    @Prop() minColor = "255,255,255";
    @Prop() maxColor = "24,73,180";
    @Prop() maxHeatLevel = 48;
    @Prop() groupMaxLabelSize = 60;

    /**
     * Override of the category case
     * 0 (default) = unchanged
     * 1 = to lower case
     * 2 = to upper case
     */
    @Prop() categoryCase = FONT_CASE.LOWER_CASE;

    /**
     * 0 = Normal
     * 1 = Bold
     */
    @Prop() categoryAllStyle = FONT_STYLE.NORMAL;
    /**
     * 0 = Normal
     * 1 = Bold
     */
    @Prop() categoryOtherStyle = FONT_STYLE.NORMAL;

    @Prop() showOtherCategory = false;

    /**
     * Position the subject label of each row
     * 0 = None
     * 1 = Left
     * 2 = Right
     * 3 = Bottom
     */
    @Prop() subjectPosition = POSITION.LEFT;
    @Prop() subjectUseTaxonIcon: boolean;
    @Prop() subjectOpenNewTab: boolean = true;
    @Prop() groupNewTab: boolean = true;
    @Prop() groupClickable: boolean = true;

    /**
     * Click handling of a cell. 
     * 0 = select only the cell (1 subject, 1 group)
     * 1 = select the whole column (all subjects, 1 group)
     */
    @Prop() selectionMode = SELECTION.CELL;

    /**
     * If no value is provided, the ribbon will load without any group selected.
     * If a value is provided, the ribbon will show the requested group as selected
     * The value should be the id of the group to be selected
     */
    @Prop() selected;

    /**
     * If true, the ribbon will fire an event if a user click an empty cell
     * If false, the ribbon will not fire the event on an empty cell
     * Note: if selectionMode == SELECTION.COLUMN, then the event will trigger if at least one of the selected cells has annotations
     */
    @Prop() fireEventOnEmptyCells = false;
    
    // @Watch('selected')
    // selectedChanged(newValue, oldValue) {
    //     console.log("selectedChanged(", newValue , oldValue , ")");
    //     if(newValue != oldValue) {
    //         let gp = this.getGroup(newValue);
    //         this.selectCells(this.ribbonSummary.subjects, gp);
    //     }
    // }

    /**
     * add a cell at the beginning of each row/subject to show all annotations
     */
    @Prop() addCellAll: boolean = true;

    /**
     * if provided, will override any value provided in subjects and subset
     */
    @Prop() data : string;

    @Watch('data')
    dataChanged(newValue, oldValue) {
      if(newValue != oldValue) {
        return;
      }
    }
    
  render() {
    return (
      <div>
        <wc-ribbon-strips ref={(el) => this.ribbonStrips = el as HTMLInputElement}
                          data={this.data}
        
        >
        </wc-ribbon-strips>
      </div>
    );
  }

}
