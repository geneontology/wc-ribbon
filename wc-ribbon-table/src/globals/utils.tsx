
export function addEndingSlash(url) {
    if (url == "") return url;
    if (url.endsWith("/")) return url;
    return url + "/";
}

/**
 * Transform http://example.com/page in page
 * @param url 
 */
export function removeBaseURL(url) {
    if (!url.startsWith("http://")) return url;
    url = url.substring(7);
    let murl = url.substring(url.indexOf("/") + 1);
    return murl;
}


/**
 * For table that have cells with multiple values
 * When merging rows based on such cells with multiple values, we have to fill with empty cells the columns that
 * don't contain as many element, so we'll keep the ordering and link between merged rows
 * Note: Should only be launched once on a table
 * @param table 
 */
export function addEmptyCells(table) {
    for (let row of table.rows) {
        let nbMax = 0;
        for (let header of table.header) {
            let eqcell = row.cells.filter(elt => elt.headerId == header.id)[0];
            // console.log("R: ", row , "H: ", header , "E:", eqcell);
            nbMax = Math.max(nbMax, eqcell.values.length);
        }
        for (let header of table.header) {
            let eqcell = row.cells.filter(elt => elt.headerId == header.id)[0];
            while (eqcell.values.length < nbMax) {
                eqcell.values.push({ label: "" });
            }
        }
    }
    return table;
}

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

export function bioLinkToTable(data, curie) {
    let table = {
        newTab: true,
        header: [
            {
                label: "Aspect",
                id: "aspect",
                // hide: true
            },
            {
                label: "Gene",
                id: "gene",
                description: "Gene or gene product",
                baseURL: "http://amigo.geneontology.org/amigo/gene_product/",
                // hide: true
            },
            {
                label: "Qualifier",
                id: "qualifier",
                description: "Most often, describe if the gene has or has NOT a given feature (ontology term)",
                // hide: true
            },
            {
                label: "Term",
                id: "term",
                description: "Ontology term used to describe a feature of the gene product",
                baseURL: "http://amigo.geneontology.org/amigo/term/"
            },
            {
                label: "Evidence",
                id: "evidence",
                description: "Type of evidence supporting that a given gene product has a certain feature (ontology term)",
                baseURL: "http://www.ontobee.org/ontology/ECO?iri=http://purl.obolibrary.org/obo/"
            },
            {
                label: "With/From",
                description: "In case of sequence similarity, is used to state from which gene product the feature (ontology term) was inferred",
                id: "with_from"
            },
            {
                label: "Reference",
                description: "Reference that support that a given gene product has a certain feature (ontology term)",
                id: "reference"
            }
        ],

        rows: []
    };

    for (let subject of data) {
        // console.log("S:", subject);
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
                        headerId: "qualifier",
                        values: assoc.qualifiers ? assoc.qualifiers.map(elt => {
                            return {
                                label: elt
                            }
                        }) : [{ label: "" }]

                    },

                    {
                        headerId: "term",
                        values: [
                            {
                                label: assoc.object.label,
                                url: assoc.object.id,
                                tags: assoc.qualifiers ? assoc.qualifiers : undefined
                            }
                        ]
                    },

                    {
                        headerId: "evidence",
                        values: [
                            {
                                label: assoc.evidence_type,
                                description: assoc.evidence_label,
                                url: assoc.evidence.replace(":", "_")
                            }
                        ]
                    },

                    {
                        headerId: "with_from",
                        values: assoc.evidence_with ? assoc.evidence_with.map(elt => {
                            return {
                                label: elt,
                                url: curie.getIri(elt)
                            }
                        }) : [{ label: "" }]
                    },

                    {
                        headerId: "reference",
                        values: assoc.reference.map(elt => {
                            return {
                                label: elt,
                                url: curie.getIri(elt)
                            }
                        })
                    }

                ]
            })
        }
    }
    return table;
}
