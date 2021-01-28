const http = require('http');
const fs = require('fs');
const url = require('url');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const data_obj = JSON.parse(data);

let overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
let product = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
let card = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

let replace_values = function(temp_card,values){
    var output = temp_card;
    output = output.replace(/{%PRODUCT_NAME%}/g, values.productName);
    output = output.replace(/{%IMAGE%}/g, values.image);
    output = output.replace(/{%QUANTITY%}/g, values.quantity);
    output = output.replace(/{%PRICE%}/g, values.price);
    output = output.replace(/{%ID%}/g, values.id);
    output = output.replace(/{%PLACE%}/g, values.from);
    output = output.replace(/{%NUTRIENTS%}/g, values.id);
    output = output.replace(/{%DESCRIPTION%}/g, values.description);

    if(!values.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');


    return output;
};


const server = http.createServer((req,res) => {
    var path_detail = url.parse(req.url, true);
    var pathName = path_detail.pathname;
    var query = path_detail.query.id;
    if(pathName === '/' || pathName === '/overview'){

        let trial = data_obj.map(el => replace_values(card, el));
        trial = trial.join('');
        overview = overview.replace(/{%PRODUCT_CARD%}/g, trial);
        res.end(overview);


        res.writeHead('200',{
            'Content-type':'text/html',
        });

    } else if(pathName === '/product'){

        var product_html = replace_values( product, data_obj[query]);
        res.end(product_html);

        res.writeHead('200',{
            'Content-type':'text/html',
        });

    } else{
        res.end('<h1>404, Page not found!!! </h1>');
        res.writeHead('404',{
            'Content-type':'text/html',
            'Error' : 'Please give the correct URL',
        });

    }

});

server.listen('3000','127.0.0.1',() => {
    console.log('Listening to port 3000');
});