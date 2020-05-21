import { Component, h } from '@stencil/core';

import { dataMockup, Table } from '../../globals/models';
import { Prop } from '@stencil/core';

// import { addEndingSlash, removeBaseURL } from '../../globals/utils';

// import { Table, Cell, Header, HeaderCell } from '../../globals/models';

@Component({
  tag: 'wc-ribbon-table',
  styleUrl: './ribbon-table.sass',
  shadow: true
})
export class RibbonTable {

  @Prop() baseApiUrl = "http://api.geneontology.org/api/ontology/ribbon/";

  @Prop() subjectBaseUrl: string = "http://amigo.geneontology.org/amigo/gene_product/";
  @Prop() groupBaseUrl: string = "http://amigo.geneontology.org/amigo/term/";

  /**
   * Must follow the appropriate JSON data model
   * Can be given as either JSON or stringified JSON
   */
  @Prop() data : string;

  /**
   * Contains the data object with the correct model (see model.tsx)
   */
  table : Table = dataMockup;

  /**
   * Contains (header_id ; header)
   * Used to speed up some cell processing (eg access baseURL)
   */
  headerMap;

  componentWillLoad() {
    if(this.data) {
      if(typeof this.data == "string") {
        this.table = JSON.parse(this.data);
      } else {
          this.table = this.data;
      }
    }
    if(this.table) {
      this.createHeaderMap();
    }
  }

  createHeaderMap() {
    this.headerMap = new Map();
    for(let header of this.table.header) {
      this.headerMap.set(header.id, header);
    }
  }

  // fetchData() {
  //   let url = "https://api.geneontology.org/api/bioentityset/slimmer/function?slim=GO:0002376&subject=HGNC:11998&rows=-1";    
  // }

  // fetchData(subjects, group) {
  //   if(subjects.includes(",")) {
  //       subjects = subjects.split(",");
  //   }
  //   if(subjects instanceof Array) {
  //       subjects = subjects.join('&subject=');
  //   }

  //   let query = this.baseApiUrl + '?subset=' + this.subset + '&subject=' + subjects;
  //   if(this.onlyExperimental) {
  //       query += EXP_CODES.map(exp => "&ecodes=" + exp).join("");
  //   }
  //   console.log('API query is ' + query);

  //   return fetch(query)
  //   .then( (response : Response) => {
  //       return response.json();
  //   })
  //   .catch( (error) => {
  //       return error;
  //   })
  // }      


  /**
   * Will group the table rows based on unique values in specified columns
   * @param keyColumns ids of the columns to create unique rows
   * @param filterRedudancy if true, the values of merged columns will be filtered
   */
  groupByColumns(keyColumns, filterRedudancy = true) {
    var firstRow = this.table.rows[0].cells;
    var otherCells = firstRow.filter(elt => !keyColumns.includes(elt.headerId));
    var otherColumns = otherCells.map(elt => elt.headerId);
    console.log("other cols: ", otherColumns);
    
    // building the list of unique rows
    var uRows = new Map();
    for(let i = 0; i < this.table.rows.length; i++) {
      let row = this.table.rows[i];
      let keyCells = row.cells.filter(elt => keyColumns.includes(elt.headerId));
      let key = keyCells.map(elt => elt.label).join("-");

      let rows = [];
      if(uRows.has(key)) {
        rows = uRows.get(key);
      } else {
        uRows.set(key, rows);
      }
      rows.push(row);
    }
    console.log("unique rows: ", uRows);

    var newTable = { newTab: this.table.newTab, header : this.table.header, rows : [] }

    for(let [urow, rrows] of uRows.entries()) {
      console.log(urow , rrows);
      let row = { cells: [] }

      // recreating the key columns
      for(let kc of keyColumns) {
        let eqcell = rrows[0].cells.filter(elt => elt.headerId == kc);
        row.cells.push(eqcell);
      }

      // now merging the other columns
      for(let oc of otherColumns) {
        // let orcell = 
      }
    }
    return newTable;
  }


  render() {
    this.groupByColumns(["hid-1", "hid-3"], false);
    return (
      <div>
        <table class="table">
            { this.renderHeader() }
            { this.renderRows() }
        </table>
      </div>
    );
  }

  renderHeader() {
    return <tr class="table__header">
      {
        this.table.header.map( cell => {
          return [
            <th title={cell.description} class="table__header__cell">{cell.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows() {
    console.log("data: ", this.table);
    return ( 
      this.table.rows.map( row => {
        return [
          <tr class="table__row">
            {
              row.cells.map( cell => {
                let header = this.headerMap.get(cell.headerId);
                let baseURL = header.baseURL;
                // adding automatically the ending slash cause too many problem (eg base URL that are example.com/tototo?uri=)
                // baseURL = baseURL ? addEndingSlash(baseURL) : "";
                baseURL = baseURL ? baseURL : "";

                let url = cell.url;
                if(url && baseURL.length > 0) {
                  // url = baseURL + removeBaseURL(url);
                  url = baseURL + url.replace(baseURL, "");
                }

                return [
                    <td title={cell.description} class="table__row__cell">
                        { 
                          cell.url 
                            ? <a href={url} target={this.table.newTab ? "_blank" : "_self"}>{cell.label}</a> 
                            : <div  onClick={cell.clickable ? (() => this.onCellClick(cell)) : () => "" }>{cell.label}</div>
                        }
                    </td>
                ]
              })
            }
          </tr>
        ]
      })
    )
  }
 
  
  onCellClick(cell) {
    console.log("Cell clicked: ", cell);
  }

}
