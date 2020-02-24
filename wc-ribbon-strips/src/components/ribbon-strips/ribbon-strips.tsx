import { h } from '@stencil/core';

import { Component, Prop, Element, Event, EventEmitter } from '@stencil/core';

import { truncate, darken, groupKey, subjectGroupKey, arraysMatch } from '../../globals/utils';
import { COLOR_BY, POSITION, SELECTION, EXP_CODES } from '../../globals/enums';

import { RibbonModel, RibbonCategory, RibbonGroup, RibbonSubject, RibbonCellEvent, RibbonCellClick } from '../../globals/models';


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
    @Prop() colorBy = COLOR_BY.ANNOTATION_COUNT;
    @Prop() binaryColor = false;
    @Prop() minColor = [255, 255, 255];
    @Prop() maxColor = [24, 73, 180];
    @Prop() maxHeatLevel = 48;
    @Prop() groupMaxLabelSize = 60;

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

    @Event() cellClick: EventEmitter;
    @Event() cellEnter: EventEmitter;
    @Event() cellLeave: EventEmitter;

    @Event() groupClick: EventEmitter;

    @Prop() ribbonSummary: RibbonModel;
    
    loading = true;
    onlyExperimental = false;


    groupAll = {
        id: "All",
        label: "all annotations",
        description: "Show all annotations for all categories",
        type: "GlobalAll"
    }




    componentWillLoad() {
        // Prioritize data if provided
        if(this.data) {
            // If was injected as string, transform to json
            if(typeof this.data == "string") {
                this.ribbonSummary = JSON.parse(this.data);
            } else {
                this.ribbonSummary = this.data;
            }
            this.loading = false;
            this.subjects = this.ribbonSummary.subjects.map((elt => elt.id )).join(",");
            return;
        }

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
                    
                el.style.cursor = "pointer";
                this.formerColors.set(subject, el.style.background.replace(/[^\d,]/g, '').split(','));
                let newColor = darken(this.formerColors.get(subject), 0.4);
                el.style.background = "rgb(" + newColor.join(",") + ")";

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
                this.formerColor = el.style.background.replace(/[^\d,]/g, '').split(',');
                let newColor = darken(this.formerColor, 0.4);
                el.style.background = "rgb(" + newColor.join(",") + ")";

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
                if(this.formerColors) {
                    el.style.background = "rgb(" + this.formerColors.get(subject).join(",") + ")";
                }
            }
            this.formerColors = undefined;

        } else {
            // change the cell style
            let el = this.ribbonElement.querySelector("#" + subjectGroupKey(subjects, group));
            if(this.formerColor) {
                el.style.background = "rgb(" + this.formerColor.join(",") + ")";
                this.formerColor = undefined;
            }

            // change the header style
            el = this.ribbonElement.querySelector("#" + groupKey(group));
            el.classList.remove("selected")
        }
        let event : RibbonCellEvent = { subjects : subjects, group: group };
        this.cellLeave.emit(event);
    }

    previouslySelected = [];
    onCellClick(subjects, group) {
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
        for(let subject of subjects) {
            let cell = this.ribbonElement.querySelector("#" + subjectGroupKey(subject, group));
            cell.selected = !cell.selected;
            selected.push(cell.selected);
            this.previouslySelected.push(cell);
        }

        let event : RibbonCellClick = { subjects : subjects, group: group, selected : selected };
        this.cellClick.emit(event);
    }

    onGroupClick(group) {
        let event = { group : group }
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

    render() {
        console.log("render:\n- loading: " , this.loading , "\n- summary: ", this.ribbonSummary);

        // Still loading (executing fetch)
        if(this.loading) {
            return ( "Loading Ribbon..." );
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
                            onClick={ (this.groupClickable) ? () => this.onGroupClick(this.groupAll) : undefined }>
                            {truncate(this.groupAll.label, this.groupMaxLabelSize, "...")}
                            
                    </th>                
                    : ""
                }

                {
                    this.ribbonSummary.categories.map( (category : RibbonCategory) => {
                        return [
                            <th class="ribbon__category--separator"></th>,
                            category.groups.map( (group : RibbonGroup) => {
                                return <th class="ribbon__category--cell"
                                    id={groupKey(group)}
                                    title={group.id + ": " + group.label + "\n\n" + group.description}
                                    onClick={ (this.groupClickable) ? () => this.onGroupClick(group) : undefined }>
                                    {truncate(group.label, this.groupMaxLabelSize, "...")}
                                    
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
                                        let nbAnnotations = group.id in subject.groups ? subject.groups[group.id]["ALL"]["nb_annotations"] : 0;

                                        // TODO: that's where i can check for group.available; by default true if not here
                                        return(
                                        <wc-ribbon-cell     class={(nbAnnotations == 0 ? "ribbon__subject--cell--no-annotation" : "ribbon__subject--cell")}
                                                            id={subjectGroupKey(subject, group)}
                                                            subject={subject} 
                                                            group={group}
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

