const { JSDOM } = require('jsdom')

async function  crawlPage(baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    // return if the host is different
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    // just get the hostname and the path, lose everything else    
    const normalizedCurrentURL = normalizeURL(currentURL)

    // if already seen this pages, increment its count and return
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    // ...otherwise set it to 1
    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)

    try {
        // get the page
        const resp = await fetch(currentURL)
        if (resp.status > 300)
        {
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        // return if it doesn't have text/html in the header
        const contentType = resp.headers.get("content-type")
        if (!contentType.includes( "text/html")) {
            console.log(`non html response, content type: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        // get the body text
        const htmlBody = await resp.text()
        // find all the <a> tags
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        // ...and call this function with each of them
        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    }
    catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${baseURL}`)
    }

    return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const aElement of linkElements){
        if (aElement.href.slice(0,1) === '/'){
            try {
                urls.push(new URL(aElement.href, baseURL).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
            } else {
            try {
                urls.push(new URL(aElement.href).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return urls
}

function normalizeURL(urlString) {
    
    // get the URL standardized to be just the host and the path (no protocol or parameters etc)
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    
    if (hostPath.length >0 && hostPath.slice(-1) === '/')
    {
        return hostPath.slice(0, -1)
    }
    
    return hostPath
}

module.exports = {
    normalizeURL
    ,getURLsFromHTML
    ,crawlPage
}




