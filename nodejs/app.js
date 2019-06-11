var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app);

var url = require('url');


app.get('/', function (req, res) {
    var uri = req.url;
	var query = url.parse(uri, true).query;
	if(req.method == 'GET') {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
        if(query.serviceKey === "ossp"){
            if(query.cat === "bus"){
                getBus(query.x, query.y, res);
            }
            else if(query.cat === "hospital"){
                getHospital(query.x, query.y, query.zipCd, res);
            }
            else if(query.cat === "pharm"){
                getPharm(query.x, query.y, res);
            }
        }
        else{
            res.end("Service Key is not matched");
        }
    }

});

server.listen(8000, function() {
  console.log('Express server listening on port ' + server.address().port);
});

function getBus(x, y, res){
    const request = require('request');

    const svcKey = "ServiceKey";
    let lati = "&gpsLati=" + x;
    let long = "&gpsLong=" + y;
    let url = "http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getCrdntPrxmtSttnList?serviceKey=" + svcKey + lati + long + "&numOfRows=2000&_type=json";

    request({
        url: url,
        method: 'GET'
    }, (error, reponse, json) => {
        res.end(json);
    })
}

function getHospital(x, y, zipCd, res){
    const request = require('request');

    const svcKey = "ServiceKey";
    let xpos = "&xPos=" + y;
    let ypos = "&yPos=" + x;
    let zip = "&zipCd=" + zipCd;
    let url = "http://apis.data.go.kr/B551182/hospInfoService/getHospBasisList?serviceKey=" + svcKey + xpos + ypos + "&radius=500&numOfRows=5000" + zip + "&_type=json"

    request({
        url: url,
        method: 'GET'
    }, (error, reponse, json) => {
        res.end(json);
    })
}

function getPharm(x, y, res){
    const request = require('request');

    const svcKey = "ServiceKey";
    let xpos = "&WGS84_LON=" + y;
    let ypos = "&WGS84_LAT=" + x;
    let url = "http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyLcinfoInqire?serviceKey=" + svcKey + xpos + ypos + "&numOfRows=30&_type=json";

    request({
        url: url,
        method: 'GET'
    }, (error, reponse, json) => {
        res.end(json);
    })
}