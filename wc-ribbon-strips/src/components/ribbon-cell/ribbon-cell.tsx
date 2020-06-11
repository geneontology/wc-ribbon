import { h } from '@stencil/core';

import { Component, Prop, Element } from '@stencil/core';

import { heatColor, darken } from '../../globals/utils';
import { COLOR_BY } from '../../globals/enums';

import { RibbonGroup, RibbonSubject } from '../../globals/models';
import { Watch } from '@stencil/core';


@Component({
    tag: 'wc-ribbon-cell',
    styleUrl: './ribbon-cell.sass',
    shadow: false
})
export class RibbonCell {

    @Element() el: HTMLElement;

    @Prop() subject : RibbonSubject;
    @Prop() group : RibbonGroup;

    @Prop() classLabels = "term,terms";
    @Prop() annotationLabels = "annotation,annotations";
    @Prop() colorBy = COLOR_BY.CLASS_COUNT;
    @Prop() binaryColor = false;
    @Prop() minColor = "255,255,255";
    @Prop() maxColor = "24,73,180";
    @Prop() maxHeatLevel = 48;

    arrayMinColor;
    arrayMaxColor;

    @Watch("minColor")
    minColorChanged(newValue, oldValue) {
        if(newValue != oldValue)
            this.updateMinColor(newValue);
    }
    updateMinColor(newValue) {
        if(newValue instanceof Array) {
            this.arrayMinColor = newValue;
        } else if(newValue.includes(",")) {
            this.arrayMinColor = newValue.split(",");
        }
        this.arrayMinColor = this.arrayMinColor.map(elt => +elt);
    }

    @Watch("maxColor")
    maxColorChanged(newValue, oldValue) {
        if(newValue != oldValue)
            this.updateMaxColor(newValue);
    }
    updateMaxColor(newValue) {
        if(newValue instanceof Array) {
            this.arrayMaxColor = newValue;
        } else if(newValue.includes(",")) {
            this.arrayMaxColor = newValue.split(",");
        }
        this.arrayMaxColor = this.arrayMaxColor.map(elt => +elt);
    }

    arrayAnnotationLabels;
    arrayClassLabels;

    @Watch("annotationLabels")
    annotationLabelsChanged(newValue, oldValue) {
        if(newValue != oldValue)
            this.updateAnnotationLabels(newValue);
    }
    updateAnnotationLabels(newValue) {
        if(newValue instanceof Array) {
            this.arrayAnnotationLabels = newValue;
        } else if(newValue.includes(",")) {
            this.arrayAnnotationLabels = newValue.split(",");
        }
        this.arrayAnnotationLabels = this.arrayAnnotationLabels.map(elt => elt.trim());
    }

    @Watch("classLabels")
    classLabelsChanged(newValue, oldValue) {
        if(newValue != oldValue)
            this.updateClassLabels(newValue);
    }
    updateClassLabels(newValue) {
        if(newValue instanceof Array) {
            this.arrayClassLabels = newValue;
        } else if(newValue.includes(",")) {
            this.arrayClassLabels = newValue.split(",");
        }
        this.arrayClassLabels = this.arrayClassLabels.map(elt => elt.trim());
    }    

    /**
     * If set to true, won't show any color and can not be hovered or selected
     * This is used for group that can not have annotation for a given subject
     */
    @Prop() available = true;
    @Prop() selected = false;
    @Prop() hovered = false;


    cellColor(nbClasses, nbAnnotations) {
        var levels = (this.colorBy == COLOR_BY.CLASS_COUNT) ? nbClasses : nbAnnotations;
        let newColor = heatColor(levels, this.maxHeatLevel, this.arrayMinColor, this.arrayMaxColor, this.binaryColor);
        if(this.hovered) {
            let tmp = newColor.replace(/[^\d,]/g, '').split(',');
            let val = darken(tmp, 0.4);
            newColor = "rgb(" + val.join(",") + ")";
        }
        return newColor;
    }

    getNbClasses() {
        if(this.group.type == "GlobalAll") {
            return this.subject.nb_classes;
        } else {
            return this.group.id in this.subject.groups ? this.subject.groups[this.group.id]["ALL"]["nb_classes"] : 0;;
        }
    }

    getNbAnnotations() {
        if(this.group.type == "GlobalAll") {
            return this.subject.nb_annotations;
        } else {
            return this.group.id in this.subject.groups ? this.subject.groups[this.group.id]["ALL"]["nb_annotations"] : 0;;
        }
    }

    hasAnnotations() {
        return this.getNbAnnotations() > 0;
    }

    /** 
     * This is executed once when the component gets loaded
    */
    componentWillLoad() {
        this.updateMinColor(this.minColor);
        this.updateMaxColor(this.maxColor);
        this.updateAnnotationLabels(this.annotationLabels);
        this.updateClassLabels(this.classLabels);
    }

    render() {
        if(!this.available) {
            let title = this.subject.label + " can not have data for " + this.group.label;
            let classes = "ribbon__subject--cell unavailable";
            return (<td title={title} class={classes}> </td>);            
        }

        let nbClasses = this.getNbClasses();
        let nbAnnotations = this.getNbAnnotations();

        let title = "Subject: " + this.subject.id + ":" + this.subject.label + "\n\nGroup: " + this.group.id + ": " + this.group.label;
        
        if (nbAnnotations > 0) {
            title += "\n\n" + nbClasses + " " + (nbClasses > 1 ? this.arrayClassLabels[1] : this.arrayClassLabels[0]) + ", " + nbAnnotations + " " + (nbAnnotations > 1 ? this.arrayAnnotationLabels[1] : this.arrayAnnotationLabels[0]);
        } else {
            title += "\n\nNo data available";
        }
        this.el.style.setProperty('background', this.cellColor(nbClasses, nbAnnotations));

        let classes = (this.selected && nbAnnotations > 0) ? "ribbon__subject--cell clicked" : "ribbon__subject--cell"
        classes += (this.hovered && nbAnnotations > 0) ? " hovered" : ""
        return (<td title={title} class={classes}> </td>);
    }

}