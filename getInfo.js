var req = require('request');
var urljoin = require('url-join');
var parser = require('fast-xml-parser');   

var url = 'https://api.e-stat.go.jp/rest/1.0/app/getStatsList';
var appId = 'xxxxxx';
var lang = 'ja';

//政府統計コード
var statsCode  = '00552010';

var fullUrl = urljoin(url,'?appId='+appId,'?land='+lang,'?statsCode='+statsCode);
console.log(fullUrl);

var options = {
    url: fullUrl,
    method: 'GET'
}

req(options, function (error, response, body) {
    if (error) {
        console.log('Error: ' + error.message);
        return;
    }
    var xmlOption = {
        attributeNamePrefix : "",//Attribute名の先頭prefixを指定しない
        ignoreAttributes : false
    }
    var jsonData = parser.parse(body,xmlOption);
    var listData = jsonData.GET_STATS_LIST.DATALIST_INF.LIST_INF;
    //console.log(listData);
    var spredData = listData[0];
    console.log(spredData);
    nextFunction(spredData);

})

function nextFunction(data){

    var url2 = 'https://api.e-stat.go.jp/rest/1.0/app/getStatsData';
    var statsDataId = data.id;
    var fullUrl2 = urljoin(url2,'?appId='+appId,'?land='+lang,'?statsDataId='+statsDataId);
    console.log(fullUrl2);
    var options = {
        url: fullUrl2,
        method: 'GET'
    }
    req(options, function (error, response, body) {
        if (error) {
            console.log('Error: ' + error.message);
            return;
        }
       var xmlOption = {
        attributeNamePrefix : "",//Attribute名の先頭prefixを指定しない
        ignoreAttributes : false
        }
        var jsonData = parser.parse(body,xmlOption);
        console.log(jsonData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE);
    })
}
