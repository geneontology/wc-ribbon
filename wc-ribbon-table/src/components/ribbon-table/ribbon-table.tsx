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


  render() {
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
