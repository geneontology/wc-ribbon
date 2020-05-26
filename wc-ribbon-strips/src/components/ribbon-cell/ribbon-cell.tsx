import { h } from '@stencil/core';

import { Component, Prop, Element } from '@stencil/core';

import { heatColor, darken } from '../../globals/utils';
import { COLOR_BY } from '../../globals/enums';

import { RibbonGroup, RibbonSubject } from '../../globals/models';


@Component({
    tag: 'wc-ribbon-cell',
    styleUrl: './ribbon-cell.sass',
    shadow: false
})
export class RibbonCell {

    @Element() el: HTMLElement;

    @Prop() subject : RibbonSubject;
    @Prop() group : RibbonGroup;

    @Prop() classLabels = ["term", "terms"];
    @Prop() annotationLabels = ["annotation", "annotations"];
    @Prop() colorBy = COLOR_BY.CLASS_COUNT;
    @Prop() binaryColor = false;
    @Prop() minColor = [255, 255, 255];
    @Prop() maxColor = [24, 73, 180];
    @Prop() maxHeatLevel = 48;

    /**
     * If set to true, won't show any color and can not be hovered or selected
     * This is used for group that can not have annotation for a given subject
     */
    @Prop() available = true;
    @Prop() selected = false;
    @Prop() hovered = false;


    cellColor(nbClasses, nbAnnotations) {
        var levels = (this.colorBy == COLOR_BY.CLASS_COUNT) ? nbClasses : nbAnnotations;
        let newColor = heatColor(levels, this.maxHeatLevel, this.minColor, this.maxColor, this.binaryColor);
        if(this.hovered) {
            let tmp = newColor.replace(/[^\d,]/g, '').split(',');
            let val = darken(tmp, 0.4);
            newColor = "rgb(" + val.join(",") + ")";
        }
        return newColor;
    }

    render() {
        if(!this.available) {
            let title = this.subject.label + " can not have data for " + this.group.label;
            let classes = "ribbon__subject--cell unavailable";
            return (<td title={title} class={classes}> </td>);            
        }

        let nbClasses = 0;
        let nbAnnotations = 0;

        if(this.group.type == "GlobalAll") {
            nbClasses = this.subject.nb_classes;
            nbAnnotations = this.subject.nb_annotations;
        } else {
            nbClasses = this.group.id in this.subject.groups ? this.subject.groups[this.group.id]["ALL"]["nb_classes"] : 0;
            nbAnnotations = this.group.id in this.subject.groups ? this.subject.groups[this.group.id]["ALL"]["nb_annotations"] : 0;
        }

        let title = "Subject: " + this.subject.id + ":" + this.subject.label + "\n\nGroup: " + this.group.id + ": " + this.group.label;
        if (nbAnnotations > 0) {
            title += "\n\n" + nbClasses + " " + (nbClasses > 1 ? this.classLabels[1] : this.classLabels[0]) + ", " + nbAnnotations + " " + (nbAnnotations > 1 ? this.annotationLabels[1] : this.annotationLabels[0]);
        } else {
            title += "\n\nNo data available";
        }

        if(nbAnnotations > 0) {
            this.el.style.setProperty('background', this.cellColor(nbClasses, nbAnnotations));
        }

        let classes = (this.selected && nbAnnotations > 0) ? "ribbon__subject--cell clicked" : "ribbon__subject--cell"
        classes += (this.hovered && nbAnnotations > 0) ? " hovered" : ""
        return (<td title={title} class={classes}> </td>);
    }

}