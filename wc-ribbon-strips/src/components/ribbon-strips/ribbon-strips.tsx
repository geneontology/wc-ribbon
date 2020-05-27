import { h } from '@stencil/core';

import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import { truncate, groupKey, subjectGroupKey, arraysMatch } from '../../globals/utils';
import { COLOR_BY, POSITION, SELECTION, EXP_CODES, CELL_TYPES, FONT_CASE, FONT_STYLE } from '../../globals/enums';

import { RibbonModel, RibbonCategory, RibbonGroup, RibbonSubject, RibbonCellEvent, RibbonCellClick, RibbonGroupEvent } from '../../globals/models';
import { State } from '@stencil/core';
import { Watch } from '@stencil/core';


@Component({
    tag: 'wc-ribbon-strips',
    styleUrl: './ribbon-strips.sass',
    shadow: false
})
export class RibbonStrips {

    @Element() ribbonElement;

    @Prop() baseApiUrl = "http://api.geneontology.org/api/ontology/ribbon/";

    @Prop() subjectBaseUrl: string = "http://amigo.geneontology.org/amigo/gene_product/";
    @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

    @Prop() subset: string = "goslim_agr";

    /**
     * provide gene ids (e.g. RGD:620474,RGD:3889 or as a list ["RGD:620474", "RGD:3889"])
     */
    @Prop() subjects: string = undefined;

    @Prop() classLabels = ["term", "terms"];
    @Prop() annotationLabels = ["annotation", "annotations"];

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
    @Prop() minColor = [255, 255, 255];
    @Prop() maxColor = [24, 73, 180];
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
    @Prop() selectionMode = SELECTION.COLUMN;

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

    @State() selectedGroup: RibbonGroup;

    /**
     * This event is triggered whenever a ribbon cell is clicked
     */
    @Event() cellClick: EventEmitter;

    /**
     * This event is triggered whenever the mouse enters a cell area
     */
    @Event() cellEnter: EventEmitter;

    /**
     * This event is triggered whenever the mouse leaves a cell area
     */
    @Event() cellLeave: EventEmitter;

    /**
     * This event is triggered whenever a group cell is clicked
     */
    @Event() groupClick: EventEmitter;

    /**
     * This event is triggered whenever the mouse enters a group cell area
     */
    @Event() groupEnter: EventEmitter;

    /**
     * This event is triggered whenever the mouse leaves a group cell area 
     */
    @Event() groupLeave: EventEmitter;

    @Prop() ribbonSummary: RibbonModel;
    
    loading = true;
    onlyExperimental = false;


    groupAll : RibbonGroup = {
        id: "All",
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


    /** 
     * Once the component is loaded, fetch the data
    */
    componentDidLoad() {
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
                console.log("RS: " , this.ribbonSummary);
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
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

        let subs = subjects.map(elt => elt.id + "@" + group.id);
        let prevSubs = this.previouslyHovered.map(elt => elt.subject.id + "@" + elt.group.id);
        let same = arraysMatch(subs, prevSubs);

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
    selectCells(subjects, group) {
        if(!(subjects instanceof Array)) {
            subjects = [subjects];
        }

        let subs = subjects.map(elt => elt.id + "@" + group.id);
        let prevSubs = this.previouslySelected.map(elt => elt.subject.id + "@" + elt.group.id);
        let same = arraysMatch(subs, prevSubs);

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
            cell.selected = !cell.selected;
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
        
        let selected = this.selectCells(subjects, group);

        let event : RibbonCellClick = { subjects : subjects, group: group, selected : selected };
        this.cellClick.emit(event);
    }

    onGroupClick(category, group) {
        this.selectCells(this.ribbonSummary.subjects, group);
        let event = { category : category, group : group }
        this.groupClick.emit(event);
    }

    filterExperiment(checkbox) {
        this.onlyExperimental = checkbox.target.checked;

        // Fetch data based on subjects and subset
        this.fetchData(this.subjects)
        .then(
            data => {
                this.ribbonSummary = data;
                this.loading = false;
                console.log("RS: " , this.ribbonSummary);
            },
            error => {
                console.error(error);
                this.loading = false;
            }
        );
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
                                if(group.type == CELL_TYPES.OTHER && !this.showOtherCategory) {
                                    return ;
                                }

                                let classes = this.groupClickable ? "ribbon__category--cell clickable" : "ribbon__category--cell";
                                return <th class={classes}
                                    id={groupKey(group)}
                                    title={group.id + ": " + group.label + "\n\n" + group.description}
                                    onMouseEnter={() => this.onGroupEnter(category, group)}
                                    onMouseLeave={() => this.onGroupLeave(category, group)}
                                    onClick={ (this.groupClickable) ? () => this.onGroupClick(category, group) : undefined }>
                                    {this.selectedGroup == group ? <b>{this.applyCategoryStyling(group.label)}</b> : this.applyCategoryStyling(group.label) }       
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
                            this.subjectPosition == POSITION.LEFT ? <wc-ribbon-subject  class="ribbon__subject__label--left"
                                                subject={subject} 
                                                subjectBaseURL={this.subjectBaseUrl} newTab={this.subjectOpenNewTab}/> : ""
                        }

                        {         
                            this.addCellAll ? 
                            <wc-ribbon-cell     class="ribbon__subject--cell"
                                                id={subjectGroupKey(subject, this.groupAll)}                                                
                                                subject={subject} 
                                                group={this.groupAll}
                                                colorBy={this.colorBy}
                                                binaryColor={this.binaryColor}
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
                                        let cell = group.id in subject.groups ? subject.groups[group.id] : undefined;

                                        let nbAnnotations = cell ? cell["ALL"]["nb_annotations"] : 0;
                                        
                                        // by default the group should be available
                                        let available = true;

                                        // if a value was given, then override the default value
                                        if(cell && cell.available) available = cell.available;

                                        // TODO: fix the Cells of type "Other"
                                        if(group.type == CELL_TYPES.OTHER && !this.showOtherCategory) {
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
                                                            onClick={() => this.onCellClick(subjects, group)}
                                                            onMouseEnter={() => this.onCellEnter(subjects, group)}
                                                            onMouseLeave={() => this.onCellLeave(subjects, group)}
                                        />
                                        )

                                    })
                                ];
                            })
                        }

                        {
                            this.subjectPosition == POSITION.RIGHT ? <wc-ribbon-subject  class="ribbon__subject__label--right"
                                                subject={subject} 
                                                subjectBaseURL={this.subjectBaseUrl} newTab={this.subjectOpenNewTab}/> : ""
                        }
                        
                    </tr>
                )
            })
        );
    }


}

