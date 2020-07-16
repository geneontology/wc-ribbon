export function aspectShortLabel(txt) {
    if (txt == "biological_process") {
        return "P";
    } else if (txt == "molecular_activity" || txt == "molecular_function") {
        return "F";
    } else if (txt == "cellular_component") {
        return "C";
    }
    return "U";
}

export function bioLinkToTable(slimmer_response) {
    let table = {
        newTab: true,
        header: [
            {
                label: "Aspect",
                id: "aspect",
                hide: false
            },
            {
                label: "Gene",
                id: "gene",
                baseURL: "http://amigo.geneontology.org/amigo/gene_product/"
            },
            {
                label: "Term",
                id: "term",
                baseURL: "http://amigo.geneontology.org/amigo/term/"
            },
            {
                label: "Evidence",
                id: "evidence",
                baseURL: "http://www.ontobee.org/ontology/ECO?iri=http://purl.obolibrary.org/obo/"
            },
            {
                label: "With/From",
                id: "with_from"
            },
            {
                label: "Reference",
                id: "reference"
            }
        ],

        rows: []
    };

    for (let subject of slimmer_response) {
        for (let assoc of subject.assocs) {
            table.rows.push({
                cells: [
                    {
                        headerId: "aspect",
                        values: [
                            {
                                label: aspectShortLabel(assoc.object.category[0])
                            }
                        ]
                    },

                    {
                        headerId: "gene",
                        values: [
                            {
                                label: assoc.subject.label,
                                url: assoc.subject.id
                            }
                        ]
                    },

                    {
                        headerId: "term",
                        values: [
                            {
                                label: assoc.object.label,
                                url: assoc.object.id
                            }
                        ]
                    },

                    {
                        headerId: "evidence",
                        values: [
                            {
                                label: assoc.evidence_type,
                                url: assoc.evidence.replace(":", "_")
                            }
                        ]
                    },

                    {
                        headerId: "with_from",
                        values: assoc.evidence_with ? assoc.evidence_with.map(elt => {
                            return {
                                label: elt
                            }
                        }) : [{ label: "" }]
                    },

                    {
                        headerId: "reference",
                        values: assoc.reference.map(elt => {
                            return {
                                label: elt
                            }
                        })
                    }

                ]
            })
        }
    }
    return table;
}



  
  /**
   * Return the category object for a given group
   * @param {*} group group object (eg ontology term)
   */
  export function getCategory(group, categories) {
    let cat = categories.filter(cat => {
      return cat.groups.some(gp => gp.id == group.id);
    });
    return cat.length > 0 ? cat[0] : undefined;
  }

  /**
   * Return the category [id, label] for a given group
   * @param {*} group group object (eg ontology term)
   */
  export function getCategoryIdLabel(group, categories) {
    let cat = categories.filter(cat => {
      return cat.groups.some(gp => gp.id == group.id);
    });
    return cat.length > 0 ? [ cat[0].id, cat[0].label ] : undefined;
  }

  /**
   * Check if a HTML element has a parent with provided id
   * @param {} elt HTML element to check
   * @param {*} id id to look in the parents of provided element
   */
  export function hasParentElementId(elt, id) {
    if(elt.id == id) { return true; }
    if(!elt.parentElement) { return false; }
    return hasParentElementId(elt.parentElement, id);
  }


  export function associationKey(assoc) {
    if(assoc.qualifier) {
      return assoc.subject.id + '@' + assoc.object.id + '@' + assoc.negated + '@' + assoc.qualifier.join('-');
    }
    return assoc.subject.id + '@' + assoc.object.id + '@' + assoc.negated;
  }

  export function fullAssociationKey(assoc) {
    var key = associationKey(assoc) + '@' + assoc.evidence_type + '@' + assoc.provided_by + '@' + assoc.reference.join('#');
    return key;
  }

  export function diffAssociations(assocs_all, assocs_exclude) {
    var list = [];
    for(let assoc of assocs_all) {
      let found = false;
      let key_all = fullAssociationKey(assoc);
      for(let exclude of assocs_exclude) {
        let key_exclude= fullAssociationKey(exclude);
        if(key_all == key_exclude) {
          found = true;
          break;
        }
      }
      if(!found) {
        list.push(assoc);
      }
    }
    return list;
  }

  export function sameArray(array1, array2) {
	if (array1.length !== array2.length) { return false };

	for (let i = 0; i < array1.length; i++) {
		if (array1[i] !== array2[i]) { return false; }
	}
	return true;
  };