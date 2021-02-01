import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

import * as dbxrefs from '@geneontology/dbxrefs';

@Component({
  tag: 'wc-go-autocomplete',
  styleUrl: 'go-autocomplete.css',
  shadow: false,
})
export class GOAutocomplete {

  searchBox : HTMLInputElement;

  @Prop() value: string;

  @Prop() category: string = "gene";

  @Prop() maxResults = 100;

  @Prop() placeholder = "";

  @Event({eventName: 'itemSelected', cancelable: true, bubbles: true}) itemSelected: EventEmitter;

  @State() docs;  // will contain the results of the search (e.g. from the GO API)

  @State() ready = false;

  goApiUrl = "https://api.geneontology.org/api/search/entity/autocomplete/";
  ncbiTaxonUrl = "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=";


  /** 
   * Executed once during component initialization
   * Here, just ask for dbxrefs to load
  */
  componentWillLoad() {
    dbxrefs.init().then(() => {
      this.ready = true;
    })
  }

  autocomplete() {
    let url = this.goApiUrl + this.value + "?category=" + this.category + "&rows=" + this.maxResults;
    fetch(url)
    .then(response => {
      if(response.status != 200) {
        console.error("Not a 200 response: ", response);
      } else {
        return response.json();
      }
    })
    .then(data => {
      this.docs = data["docs"];
      // console.log(this.docs);
    })
  }

  timer = undefined;
  newSearch(evt) {
    this.value = evt.target.value;
    if(this.timer) {
      clearTimeout(this.timer);
    }
    if(this.value.length < 2) {
      this.docs = undefined;
      return;
    }
    this.timer = setTimeout(() => {
      this.autocomplete();
    }, 800);
  }

  select(target, doc) {
    if(!target.href) {
      // console.log("doc selected: ", doc);
      this.docs = undefined;
      this.value = "";
      this.itemSelected.emit({ "selected" : doc });
    }
  }

  render() {
    return  !this.ready ? "" : <div class="autocomplete">
              <i class="fas fa-search icon-left"></i>
              <input type="text" class="input-field" value={this.value} placeholder={this.placeholder}
                            ref={(el) => this.searchBox = el as HTMLInputElement}
                            onInput={(evt) => this.newSearch(evt)}>
              </input>
              <i class="far fa-times-circle icon-right" onClick={() => {this.docs = undefined; this.value = ""} }></i>
                            
                          {!this.docs ? "" : <div class="autocomplete-items">
                                              { this.docs.map(doc => {
                                                  return this.renderDoc(doc);
                                              })}
                                              </div>}        
                            
                    
            </div>    
  }

  renderDoc(doc) {
    let url_taxon = this.ncbiTaxonUrl + doc.taxon.replace("NCBITaxon:", "");
    let db = doc.id.substring(0, doc.id.indexOf(":"));
    let id = doc.id.substring(doc.id.indexOf(":") + 1);
    let url_id = dbxrefs.getURL(db, undefined, id);

    // temporary fix while the db-xrefs.yaml gets updated
    if(url_id.includes("https://www.ncbi.nlm.nih.gov/gene/")) {
      // then this was fixed
    } else if(url_id.includes("https://www.ncbi.nlm.nih.gov/gene")) {
      url_id = url_id.replace("https://www.ncbi.nlm.nih.gov/gene", "https://www.ncbi.nlm.nih.gov/gene/")
    }

    return  <div onClick={(evt) => this.select(evt.target, doc) }>
              <span class="autocomplete__item__label">{<a href={url_id} target="blank">{doc.label[0]}</a>}</span>
              <span class="autocomplete__item__taxon">{<a href={url_taxon} target="blank">{doc.taxon_label}</a>}</span>
            </div>
  }

}
