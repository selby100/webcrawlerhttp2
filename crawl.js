const { JSDOM } = require('jsdom')


function getURLsFromHTML(htmlBody, baseURL)
{
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
    
    return urls
}

function normalizeURL(urlString)
{
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
}




