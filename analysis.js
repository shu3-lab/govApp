var req = require('request');
var urljoin = require('url-join');
var parser = require('fast-xml-parser');   

var url1 = 'http://api.e-stat.go.jp/rest/2.1/app/getStatsData?appId=b478bf7f8272b4102f88789f9bd4268620f14e14&lang=J&statsDataId=0003254482&metaGetFlg=Y&cntGetFlg=N&sectionHeaderFlg=1'
var options = {
    url: url1,
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
    console.log(jsonData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF);

})