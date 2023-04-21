import { h, Component, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';

import { truncate, groupKey, subjectGroupKey, sameArray } from '../../globals/utils';
import { RibbonModel, RibbonCategory, RibbonGroup, RibbonSubject, RibbonCellEvent, RibbonCellClick, RibbonGroupEvent } from '../../globals/models';

import { COLOR_BY, POSITION, SELECTION, EXP_CODES, CELL_TYPES, FONT_CASE, FONT_STYLE } from '../../globals/enums';
import { Method } from '@stencil/core';


@Component({
    tag: 'wc-ribbon-strips',
    styleUrl: './ribbon-strips.sass',
    shadow: false
})
export class RibbonStrips {

    @Element() ribbonElement;

    @Prop() baseApiUrl = "https://api-sierra.geneontology.io/api/ontology/ribbon/";

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

    @Prop() showOtherGroup = false;

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
            this.loadData(newValue);
        }
    }

    /**
     * When this is set to false, changing the subjects Prop won't trigger the reload of the ribbon
     * This is necessary when the ribbon is showing data other than GO or not using the internal fetchData mechanism
     */
    @Prop() updateOnSubjectChange = true;

  /**
   * This method is automatically called whenever the value of "subjects" changes
   * Note this method can be (and should be) deactivated (use updateOnSubjectChange)
   * when the ribbon is not loading from GO and not using the internal fetchData mechanism
   * @param newValue a new subject is submitted (e.g. gene)
   * @param oldValue old value of the subject (e.g. gene or genes)
   */
  @Watch('subjects')
  subjectsChanged(newValue, oldValue) {
      // if we don't want to update the ribbon on subject changes
      if(!this.updateOnSubjectChange) { this.loading = false; return; }

      if(newValue != oldValue) {
        // Fetch data based on subjects and subset
        this.fetchData(this.subjects)
        .then(
            data => {
                this.ribbonSummary = data;
                this.loading = false;
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
      }
  }

    @State() selectedGroup: RibbonGroup;

    /**
     * This event is triggered whenever a ribbon cell is clicked
     */
    @Event({eventName: 'cellClick', cancelable: true, bubbles: true}) cellClick: EventEmitter;

    /**
     * This event is triggered whenever the mouse enters a cell area
     */
    @Event({eventName: 'cellEnter', cancelable: true, bubbles: true}) cellEnter: EventEmitter;

    /**
     * This event is triggered whenever the mouse leaves a cell area
     */
    @Event({eventName: 'cellLeave', cancelable: true, bubbles: true}) cellLeave: EventEmitter;

    /**
     * This event is triggered whenever a group cell is clicked
     */
    @Event({eventName: 'groupClick', cancelable: true, bubbles: true}) groupClick: EventEmitter;

    /**
     * This event is triggered whenever the mouse enters a group cell area
     */
    @Event({eventName: 'groupEnter', cancelable: true, bubbles: true}) groupEnter: EventEmitter;

    /**
     * This event is triggered whenever the mouse leaves a group cell area
     */
    @Event({eventName: 'groupLeave', cancelable: true, bubbles: true}) groupLeave: EventEmitter;



    @Prop() ribbonSummary: RibbonModel;

    loading = true;
    onlyExperimental = false;


    groupAll : RibbonGroup = {
        id: "all",
        label: "all annotations",
        description: "Show all annotations for all categories",
        type: "GlobalAll"
    }



    loadData(data) {
        if(data) {
            // If was injected as string, transform to json
            if(typeof data == "string") {
                this.ribbonSummary = JSON.parse(data);
            } else {
                this.ribbonSummary = data;
            }
            this.loading = false;
            this.subjects = this.ribbonSummary.subjects.map((elt => elt.id )).join(",");
            return true;
        }
        return false;
    }

    getGroup(group_id) {
        if(!this.ribbonSummary)
            return null;
        if(group_id == "all")
            return this.groupAll;
        for(let cat of this.ribbonSummary.categories) {
            for(let gp of cat.groups) {
                if(gp.id == group_id)
                    return gp;
            }
        }
        return null;
    }

    /**
     * Once the component is loaded, fetch the data
    */
    componentWillLoad() {
        // Prioritize data if provided
        if(this.loadData(this.data))
            return;

        // If no subjects were provided, don't try to fetch data
        if(!this.subjects) {
            this.loading = false;
            return;
        }

        // Fetch data based on subjects and subset
        this.fetchData(this.subjects)
        .then(
            data => {
                this.ribbonSummary = data;
                this.loading = false;
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    componentDidLoad() {
        this.selectGroup(this.selected)
        this.selected = null;
    }

    fetchData(subjects) {
        if(subjects.includes(",")) {
            subjects = subjects.split(",");
        }
        if(subjects instanceof Array) {
            subjects = subjects.join('&subject=');
        }

        let query = this.baseApiUrl + '?subset=' + this.subset + '&subject=' + subjects;
        if(this.onlyExperimental) {
            query += EXP_CODES.map(exp => "&ecodes=" + exp).join("");
        }
        console.log('API query is ' + query);

        return fetch(query)
        .then( (response : Response) => {
            return response.json();
        })
        .catch( (error) => {
            return error;
        })
    }


    filterExperiment(checkbox) {
        this.onlyExperimental = checkbox.target.checked;

        // Fetch data based on subjects and subset
        this.fetchData(this.subjects)
        .then(
            data => {
                this.ribbonSummary = data;
                this.loading = false;
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    formerColor;
    formerColors;
    onCellEnter(subjects, group) {
        if(subjects instanceof Array) {
            this.formerColors = new Map();

            // change header style
            let el = this.ribbonElement.querySelector("#" + groupKey(group));
            el.classList.add("selected")

            for(let subject of subjects) {
                let el = this.ribbonElement.querySelector("#" + subjectGroupKey(subject, group));
                el.hovered = true;
                el.style.cursor = "pointer";
            }

        } else {
            // change cell style
            let nbAnnotations = group.id in subjects.groups ? subjects.groups[group.id]["ALL"]["nb_annotations"] : 0;
            if(group.type == "GlobalAll") {
                nbAnnotations = subjects.nb_annotations;
            } else {
                nbAnnotations = group.id in subjects.groups ? subjects.groups[group.id]["ALL"]["nb_annotations"] : 0;
            }

            // let el = this.ribbonElement.shadowRoot.querySelector("#" + this.transform(subjects.id) + "-" + this.transform(group.id));
            let el = this.ribbonElement.querySelector("#" + subjectGroupKey(subjects, group));

            el.style.cursor = nbAnnotations == 0 ? "not-allowed" : "pointer";

            if(nbAnnotations > 0) {
                el.hovered = true;

                // change header style
                el = this.ribbonElement.querySelector("#" + groupKey(group));
                el.classList.add("selected")
            }
        }
        let event : RibbonCellEvent = { subjects : subjects, group: group };
        this.cellEnter.emit(event);
    }

    onCellLeave(subjects, group) {
        if(subjects instanceof Array) {

            // change the header style
            let el = this.ribbonElement.querySelector("#" + groupKey(group));
            el.classList.remove("selected")

            for(let subject of subjects) {
                let el = this.ribbonElement.querySelector("#" + subjectGroupKey(subject, group));
                el.hovered = false;
            }
            this.formerColors = undefined;

        } else {
            // change the cell style
            let el = this.ribbonElement.querySelector("#" + subjectGroupKey(subjects, group));
            el.hovered = false;

            // change the header style
            el = this.ribbonElement.querySelector("#" + groupKey(group));
            el.classList.remove("selected")
        }
        let event : RibbonCellEvent = { subjects : subjects, group: group };
        this.cellLeave.emit(event);
    }

    previouslyHovered = [];
    overCells(subjects, group) {
        if(!(subjects instanceof Array)) {
            subjects = [subjects];
        }

        let subs = subjects.map(elt => elt.id + "@" + group.id + "@" + group.type);
        let prevSubs = this.previouslyHovered.map(elt => elt.subject.id + "@" + elt.group.id + "@" + elt.group.type);
        let same = sameArray(subs, prevSubs);

        if(!same) {
            for(let cell of this.previouslyHovered) {
                cell.hovered = false;
            }
        }
        this.previouslyHovered = [];

        let hovered : boolean[] = [];
        for(let subject of subjects) {
            let cell = this.ribbonElement.querySelector("#" + subjectGroupKey(subject, group));
            cell.hovered = !cell.hovered;
            hovered.push(cell.hovered);
            this.previouslyHovered.push(cell);
        }
        return hovered;
    }

    previouslySelected = [];
    selectCells(subjects, group, toggle = true) {
        if(!(subjects instanceof Array)) {
            subjects = [subjects];
        }

        let subs = subjects.map(elt => elt.id + "@" + group.id + "@" + group.type);
        let prevSubs = this.previouslySelected.map(elt => elt.subject.id + "@" + elt.group.id + "@" + elt.group.type);
        let same = sameArray(subs, prevSubs);

        if(!same) {
            for(let cell of this.previouslySelected) {
                cell.selected = false;
            }
        }
        this.previouslySelected = [];

        let selected : boolean[] = [];
        let lastCell;
        for(let subject of subjects) {
            let cell = this.ribbonElement.querySelector("#" + subjectGroupKey(subject, group));
            cell.selected = toggle ? !cell.selected : true;
            selected.push(cell.selected);
            this.previouslySelected.push(cell);
            lastCell = cell;
        }
        if(lastCell.selected) {
            this.selectedGroup = group;
        } else {
            this.selectedGroup = undefined;
        }
        return selected;
    }

    onCellClick(subjects, group) {
        if(!(subjects instanceof Array)) {
            subjects = [subjects];
        }

        // if don't fire events on empty cells
        if(!this.fireEventOnEmptyCells) {
            let hasAnnotations = false;
            // if single cell selection, check if it has annotations
            if(this.selectionMode == SELECTION.CELL) {
                let keys = Object.keys(subjects[0].groups);
                for(let key of keys) {
                    if(subjects[0].groups[key]["ALL"].nb_annotations > 0)
                        hasAnnotations = true;
                }

            // if multiple cells selection, check if at least one has annotations
            } else {
                for(let sub of subjects) {
                    if(group.id == "all") {
                        hasAnnotations = hasAnnotations || sub.nb_annotations > 0;
                    } else {
                        hasAnnotations = hasAnnotations || (group.id in sub.groups && sub.groups[group.id]["ALL"]["nb_annotations"] > 0);
                    }
                }
            }
            if(!hasAnnotations) { return; }
        }

        let selected = this.selectCells(subjects, group);

        let event : RibbonCellClick = { subjects : subjects, group: group, selected : selected };
        this.cellClick.emit(event);
    }

    onGroupClick(category, group) {
        this.selectCells(this.ribbonSummary.subjects, group);
        let event = { category : category, group : group }
        this.groupClick.emit(event);
    }

    onGroupEnter(category, group) {
        this.overCells(this.ribbonSummary.subjects, group);
        let event : RibbonGroupEvent = { subjects : this.ribbonSummary.subjects, category : category, group: group };
        this.groupEnter.emit(event);
    }

    onGroupLeave(category, group) {
        this.overCells(this.ribbonSummary.subjects, group);
        let event : RibbonGroupEvent = { subjects : this.ribbonSummary.subjects, category : category, group: group };
        this.groupLeave.emit(event);
    }


    applyCategoryStyling(category) {
        let cc0 = truncate(category, this.groupMaxLabelSize, "...");
        let cc1 = this.applyCategoryCase(cc0);
        let cc2 = this.applyCategoryBold(cc1);
        return cc2;
    }

    applyCategoryBold(category) {
        let lc = category.toLowerCase();
        if(lc.startsWith("all") && this.categoryAllStyle == FONT_STYLE.BOLD) {
            return <b>{category}</b>;
        }
        if(lc.startsWith("other") && this.categoryOtherStyle == FONT_STYLE.BOLD) {
            return <b>{category}</b>;
        }
        return category;
    }

    applyCategoryCase(category) {
        if(this.categoryCase == FONT_CASE.LOWER_CASE) {
            return category.toLowerCase();
        } else if(this.categoryCase == FONT_CASE.UPPER_CASE) {
            return category.toUpperCase();
        }
        return category;
    }


    @Method()
    async selectGroup(group_id) {
        setTimeout(() => {
            if(group_id && this.ribbonSummary) {
                let gp = this.getGroup(group_id);
                if(gp) {
                    this.selectCells(this.ribbonSummary.subjects, gp, false);
                } else {
                    console.warn("Could not find group <" , group_id , ">");
                }
            }
        }, 750);
    }


    render() {
        // return [ "hello", <Spinner spinner-style='default' spinner-color='blue' style='display:block;width:100px;height:100px'/>]

        // Still loading (executing fetch)
        if(this.loading) {
            // return ( "Loading Ribbon..." );
            return <wc-spinner spinner-style='default' spinner-color='blue'></wc-spinner>
        }

        if(!this.subjects && !this.ribbonSummary) {
            return ( <div>Must provide at least one subject</div> )
        }

        // API request undefined
        if (!this.ribbonSummary) {
            return ( <div>No data available</div> );
        }

        // API request done but not subject retrieved
        let nbSubjects : number = this.ribbonSummary.subjects.length;
        if(nbSubjects == 0) {
            return ( <div>Must provide at least one subject</div> )
        }

        // Data is present, show the ribbon
        return (
            <div>
            <table class="ribbon">
                { this.renderCategory() }
                { this.renderSubjects() }
            </table>
            {/* <br/>
            <input type="checkbox" onClick={ this.filterExperiment.bind(this) }/> Show only experimental annotations */}
            </div>
        );
    }

    renderCategory() {
        return (
            <tr class="ribbon__category">

                {
                    this.subjectPosition == POSITION.LEFT ? <td  class="ribbon__subject__label--left"></td> : ""
                }

                {
                    this.addCellAll ?
                    <th     class="ribbon__category--cell"
                            id={groupKey(this.groupAll)}
                            title={this.groupAll.id + ": " + this.groupAll.label + "\n\n" + this.groupAll.description}
                            onMouseEnter={() => this.onGroupEnter(null, this.groupAll)}
                            onMouseLeave={() => this.onGroupLeave(null, this.groupAll)}
                            onClick={ (this.groupClickable) ? () => this.onGroupClick(undefined, this.groupAll) : undefined }>
                            {this.applyCategoryStyling(this.groupAll.label)}
                    </th>
                    : ""
                }

                {
                    this.ribbonSummary.categories.map( (category : RibbonCategory) => {
                        return [
                            <th class="ribbon__category--separator"></th>,
                            category.groups.map( (group : RibbonGroup) => {
                                if(group.type == CELL_TYPES.OTHER && !this.showOtherGroup) {
                                    return ;
                                }

                                let classes = this.groupClickable ? "ribbon__category--cell clickable" : "ribbon__category--cell";
                                return <th class={classes}
                                    id={groupKey(group)}
                                    title={group.id + ": " + group.label + "\n\n" + group.description}
                                    onMouseEnter={() => this.onGroupEnter(category, group)}
                                    onMouseLeave={() => this.onGroupLeave(category, group)}
                                    onClick={ (this.groupClickable) ? () => this.onGroupClick(category, group) : undefined }>
                                    {this.selectedGroup == group ? <b style={{"color": "#002eff"}}>{this.applyCategoryStyling(group.label)}</b> : this.applyCategoryStyling(group.label) }
                                </th>
                            })
                        ];
                    })
                }

                {
                    this.subjectPosition == POSITION.RIGHT ? <td  class="ribbon__subject__label--right"/> : ""
                }

            </tr>
        )
    }

    renderSubjects() {
        return (
            this.ribbonSummary.subjects.map( (subject : RibbonSubject) => {
                let subjects = this.selectionMode == SELECTION.CELL ? subject : this.ribbonSummary.subjects;
                return (
                    <tr class="ribbon__subject">

                        {
                            this.subjectPosition == POSITION.LEFT
                                                ? <wc-ribbon-subject    class="ribbon__subject__label--left"
                                                                        subject={subject}
                                                                        subjectBaseURL={this.subjectBaseUrl}

                                                                        newTab={this.subjectOpenNewTab}/>
                                                : ""
                        }

                        {
                            this.addCellAll ?
                            <wc-ribbon-cell     class="ribbon__subject--cell"
                                                id={subjectGroupKey(subject, this.groupAll)}
                                                subject={subject}
                                                group={this.groupAll}
                                                colorBy={this.colorBy}
                                                binaryColor={this.binaryColor}
                                                minColor={this.minColor}
                                                maxColor={this.maxColor}
                                                maxHeatLevel={this.maxHeatLevel}
                                                annotationLabels={this.annotationLabels}
                                                classLabels={this.classLabels}
                                                onClick={() => this.onCellClick(subjects, this.groupAll)}
                                                onMouseEnter={() => this.onCellEnter(subjects, this.groupAll)}
                                                onMouseLeave={() => this.onCellLeave(subjects, this.groupAll)}
                            />
                            : ""
                        }

                        {
                            this.ribbonSummary.categories.map( (category : RibbonCategory) => {
                                return [
                                    <td class="ribbon__subject--separator"></td>,
                                    category.groups.map( (group : RibbonGroup) => {
                                        let cellid = group.id + (group.type == CELL_TYPES.OTHER ? "-other" : "");
                                        let cell = cellid in subject.groups ? subject.groups[cellid] : undefined;

                                        let nbAnnotations = cell ? cell["ALL"]["nb_annotations"] : 0;

                                        // by default the group should be available
                                        let available = true;

                                        // if a value was given, then override the default value
                                        if(cell && cell.hasOwnProperty("available")) {
                                            available = cell.available;
                                        }

                                        if(group.type == CELL_TYPES.OTHER && !this.showOtherGroup) {
                                            return ;
                                        }

                                        return(
                                        <wc-ribbon-cell     class={(nbAnnotations == 0 ? "ribbon__subject--cell--no-annotation" : "ribbon__subject--cell")}
                                                            id={subjectGroupKey(subject, group)}
                                                            subject={subject}
                                                            group={group}
                                                            available={available}
                                                            colorBy={this.colorBy}
                                                            binaryColor={this.binaryColor}
                                                            minColor={this.minColor}
                                                            maxColor={this.maxColor}
                                                            maxHeatLevel={this.maxHeatLevel}
                                                            annotationLabels={this.annotationLabels}
                                                            classLabels={this.classLabels}                                                            onClick={() => this.onCellClick(subjects, group)}
                                                            onMouseEnter={() => this.onCellEnter(subjects, group)}
                                                            onMouseLeave={() => this.onCellLeave(subjects, group)}
                                        />
                                        )

                                    })
                                ];
                            })
                        }

                        {
                            this.subjectPosition == POSITION.RIGHT
                                                ? <wc-ribbon-subject    class="ribbon__subject__label--right"
                                                                        subject={subject}
                                                                        subjectBaseURL={this.subjectBaseUrl}
                                                                        newTab={this.subjectOpenNewTab}/>
                                                : ""
                        }

                    </tr>
                )
            })
        );
    }


}

