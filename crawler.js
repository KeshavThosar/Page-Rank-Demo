const { join, resolve } = require('path')
const { readdir } = require('fs').promises
const { transpose } = require('./linear-algebra')
const cheerio = require('cheerio')
const got = require('got');

async function crawl(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? crawl(res) : res;
  }));
  return Array.prototype.concat(...files);
}
function generateLinkMatrix(files, res, _linkSet){
    let promises = []
    let linkMatrix = []
    files.forEach(file => {
        let links = []
        promises.push(
            got('http://localhost:3000/'+ file.replace(join(__dirname, 'public'), '')).then(function(response){
                
                let $ = cheerio.load(response.body)
                $('a').each(function(){
                    let link = $(this).attr('href').replace('http://localhost:3000', '')
                    if(!link.startsWith('#') && !link.endsWith('.html')){
                        if(!link.endsWith('/')){
                            links.push(link + '/')
                        }else{
                            links.push(link)
                        }
                    }
                })
            }).then(function(){
                let location = file
                location = location.replace(join(__dirname, 'public'), '')
                for(let i in location){
                    if(location[i] === '\\'){
                        location = location.replace('\\', '/')
                    }
                }
                if(location.endsWith('/index.html')){
                    location = location.replace('/index.html','/')
                }
                linkMatrix.push({
                    location: location,
                    links: links
                })
    
            }).catch(function(err){
                console.log(err)
            })
        )
    })
    Promise.all(promises).then(function(){
        let linkSet = []
        let locations = JSON.parse(JSON.stringify(linkMatrix))
        locations = locations.map(({ location })=> location)
        linkMatrix.forEach(entry => {
            let splits = 0
            let temp = []
            locations.forEach(location => {
                if(entry.links.indexOf(location) >= 0){
                    temp.push(1)
                    splits++
                }else{
                    temp.push(0)
                }
            })
            temp = temp.map(e => splits>0?e/splits:0)
            linkSet.push(temp)
        })
        res.render('homepage', {locations, linkSet:transpose(linkSet), linkMatrix})
    })
}

module.exports.crawl = crawl
module.exports.generateLinkMatrix = generateLinkMatrix