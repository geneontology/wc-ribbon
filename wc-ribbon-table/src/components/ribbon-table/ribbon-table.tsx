import { Component, h } from '@stencil/core';

import { dataMockup, Table, SuperCell } from '../../globals/models';
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

  mergeCells(cells) {
    return cells;
  }


  /**
   * Will group the table rows based on unique values in specified columns
   * @param keyColumns ids of the columns to create unique rows - will only work with cells containing single value, not array
   * @param filterRedudancy if true, the values of merged columns will be filtered
   */
  groupByColumns(keyColumns, filterRedudancy = true) {
    var firstRow = this.table.rows[0].cells;
    var otherCells = firstRow.filter(elt => !keyColumns.includes(elt.headerId));
    var otherColumns = otherCells.map(elt => elt.headerId);
    // console.log("other cols: ", otherColumns);
    
    // building the list of unique rows
    var uRows = new Map();
    for(let i = 0; i < this.table.rows.length; i++) {
      let row = this.table.rows[i];
      let keyCells = row.cells.filter(elt => keyColumns.includes(elt.headerId));
      let key = keyCells.map(elt => elt.values[0].label).join("-");

      let rows = [];
      if(uRows.has(key)) {
        rows = uRows.get(key);
      } else {
        uRows.set(key, rows);
      }
      rows.push(row);
    }
    // console.log("unique rows: ", uRows);

    var newTable = { newTab: this.table.newTab, header : this.table.header, rows : [] }

    for(let rrows of uRows.values()) {
      // console.log(urow , rrows);
      let row = { cells: [] }

      // recreating the key columns
      for(let kc of keyColumns) {
        let eqcell = rrows[0].cells.filter(elt => elt.headerId == kc)[0];
        row.cells.push(eqcell);
      }

      // now merging the other columns
      for(let oc of otherColumns) {
        let supercell : SuperCell = {
          headerId: oc,
          values: []
        }
        // console.log("oc: ", oc);
        for(let eqrow of rrows) {
          let otherCell = eqrow.cells.filter(elt => elt.headerId == oc)[0]
          supercell.headerId = otherCell.headerId;
          supercell.id = otherCell.id;
          supercell.clickable = otherCell.clickable;
          supercell.foldable = otherCell.foldable;
          supercell.selectable = otherCell.selectable;
          // console.log("-- othercell: " , otherCell);
          
          // TODO: can include test here for filder redudancy
          for(let val of otherCell.values) {
            if(filterRedudancy) { }
            supercell.values.push(val);            
          }
        }
        // console.log("- values of", urow , ", ", oc , ": ", supercell);
        row.cells.push(supercell);
      }
      newTable.rows.push(row);
    }
    return newTable;
  }


  render() {
    let table = this.groupByColumns(["hid-1", "hid-3"], false);
    // console.log("TABLE:", table);
    return (
      <div>
        <table class="table">
            { this.renderHeader(table) }
            { this.renderRows(table) }
        </table>
      </div>
    );
  }

  renderHeader(table) {
    return <tr class="table__header">
      {
        table.header.map( cell => {
          return [
            <th title={cell.description} class="table__header__cell">{cell.label}</th>
          ]
        })
      }
    </tr>
  }

  renderRows(table) {
    console.log("Render table: ", table);
    return ( 
      table.rows.map( row => {
        return [
          <tr class="table__row">
            {
              row.cells.map( superCell => {
                let header = this.headerMap.get(superCell.headerId);
                let baseURL = header.baseURL;
                // adding automatically the ending slash cause too many problem (eg base URL that are example.com/tototo?uri=)
                // baseURL = baseURL ? addEndingSlash(baseURL) : "";
                baseURL = baseURL ? baseURL : "";

                return (
                  <td class="table__row__supercell">
                    <ul class="table__row__supercell__list">
                      {
                        superCell.values.map( cell => {
                          let url = cell.url;
                          if(url && baseURL.length > 0) {
                            url = baseURL + url.replace(baseURL, "");
                          }
                          return [
                            <li title={cell.description} class="table__row__supercell__cell">
                                { 
                                  cell.url 
                                    ? <a href={url} target={this.table.newTab ? "_blank" : "_self"}>{cell.label}</a> 
                                    : <div  onClick={cell.clickable ? (() => this.onCellClick(cell)) : () => "" }>{cell.label}</div>
                                }
                            </li>
                        ]                          
                        })
                      }
                    </ul>
                  </td>                  
                )

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
