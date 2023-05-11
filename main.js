const { crawlPage } = require ('./crawl.js')
const { printReport } = require ('./report.js')

async function main()
{
    // exit if args are not valid
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit()
    }
    if (process.argv.length > 3) {
        console.log("too many args")
        process.exit()
    }

    // get the base URL
    const baseURL = process.argv[2]

    // do the crawl
    console.log(`starting crawl of ${baseURL}`)
    const pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)

} 


// entry --------------------------------------------------------------------------------------------------------------------------
main()
// entry --------------------------------------------------------------------------------------------------------------------------




