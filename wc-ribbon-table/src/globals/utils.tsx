
export function addEndingSlash(url) {
    if(url == "") return url;
    if(url.endsWith("/")) return url;
    return url + "/";
}

/**
 * Transform http://example.com/page in page
 * @param url 
 */
export function removeBaseURL(url) {
    if(!url.startsWith("http://")) return url;
    url = url.substring(7);
    let murl = url.substring(url.indexOf("/") + 1);
    return murl;
}