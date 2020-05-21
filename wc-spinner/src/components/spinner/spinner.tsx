import { Component, Prop, h, Element, Watch } from '@stencil/core';

import { SPINNER_STYLE } from '../../globals/enums';

@Component({
  tag: 'wc-spinner',
  styleUrl: 'spinner.css',
  shadow: false
})
export class Spinner {

  @Element() elt;

  // export const SPINNER_STYLE = { "CIRCLE": "circle", "DUAL_RING" : "dual-ring", "FACEBOOK": "facebook", "HEART" : "heart", "RING" : "ring", "ROLLER" : "roller", "DEFAULT" : "default", "ELLIPSIS": "ellipsis", "GRID": "grid", "HOURGLASS": "hourglass", "RIPPLE": "ripple", "SPINNER": "spinner" };


  /**
   * Define the style of the spinner.
   * Accepted values: default, spinner, circle, ring, dual-ring, roller, ellipsis, grid, hourglass, ripple, facebook, heart
   */
  @Prop() spinnerStyle: string;

  /**
   * Define the size of the spinner (TO DO).
   */
  @Prop() spinnerSize: number;

  @Watch('spinnerSize')
  spinnerSizeChanged(newSize, oldSize) {
    if(newSize != oldSize) {
      this.elt.style.setProperty("--spinner-width", newSize);
      this.elt.style.setProperty("--spinner-height", newSize);
    }
  }

  /**
   * Define the color of the spinner.
   * This parameter is optional and will override any declared CSS variable
   */
  @Prop() spinnerColor: string;

  @Watch('spinnerColor')
  spinnerColorChanged(newColor, oldColor) {
    if(newColor != oldColor) {
      this.elt.style.setProperty("--color-primary", newColor);
    }
  }

  getSpinnerColor() {
    return this.elt.style.getProperty("--color-primary");
  }

  componentDidLoad() {
    if(this.spinnerColor) {
      this.spinnerColorChanged(this.spinnerColor, null);
    }
    // if(this.spinnerSize) {
    //   this.spinnerSizeChanged(this.spinnerSize, null);
    // }
  }

  componentDidUnload() {
  }

  componentWillUpdate() {
  }


  render() {
    switch(this.spinnerStyle) {
      case SPINNER_STYLE.CIRCLE:
        return <div class="lds-circle"><div></div></div>;
      case SPINNER_STYLE.DUAL_RING:
        return <div class="lds-dual-ring"></div>;
      case SPINNER_STYLE.FACEBOOK:
        return <div class="lds-facebook"><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.HEART:
        return <div class="lds-heart"><div></div></div>;
      case SPINNER_STYLE.RING:
        return <div class="lds-ring"><div></div><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.ROLLER:
        return <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.DEFAULT: 
        return <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.ELLIPSIS:
        return <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.GRID:
        return <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;
      case SPINNER_STYLE.HOURGLASS:
        return <div class="lds-hourglass"></div>;
      case SPINNER_STYLE.RIPPLE:
        return <div class="lds-ripple"><div></div><div></div></div>;
      case SPINNER_STYLE.SPINNER:
        return <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;
    }
    return <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>;
  }
}
