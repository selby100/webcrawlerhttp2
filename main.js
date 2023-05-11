const { crawlPage } = require ('./crawl.js')

function main()
{
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit()
    }

    if (process.argv.length > 3) {
        console.log("too many args")
        process.exit()
    }

    const baseURL = process.argv[2]

    console.log(`starting crawl of ${baseURL}`)
    const pages = crawlPage(baseURL, baseURL, {})

    for (const page of Object.entries(pages)) {
        console.log(page)

    }

} 

main()


