var req = require('request');
var parser = require('fast-xml-parser');   
var statistics = require('simple-statistics');

var url1 = 'https://api.e-stat.go.jp/rest/2.1/app/getStatsData?appId=XXXXXXXXXXXXXX&lang=J&statsDataId=0003288734&metaGetFlg=Y&cntGetFlg=N&sectionHeaderFlg=1'

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
        textNodeName : "value",//xmlタグの値は"value"というキーでJSON変換する
        attributeNamePrefix : "",//Attribute名の先頭prefixを指定しない
        ignoreAttributes : false
    };
    var jsonData = parser.parse(body,xmlOption);
    var dataList = jsonData.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
    var longRunList = new Array();
    var dashList = new Array();

    for(var i in dataList){
        var data = dataList[i];
        var tab = data.tab;
        var cat03 = data.cat03;
        //長距離走の平均値リストを生成
        if(tab == '00110' && cat03 == '130'){
            longRunList.push(data.value);
        }
        //50m走の平均値リストを生成
        else if(tab == '00110' && cat03 == '180'){
            dashList.push(data.value);
        }

    }
    //配列の値を全て数値にする
    longRunList = paramChange(longRunList);
    dashList = paramChange(dashList);
    //相関関係を導出する
    var correlation = statistics.sampleCorrelation(longRunList,dashList).toFixed(2);
    console.log('長距離走と50m走の相関係数は' + correlation + 'です。');
})

function paramChange(dataList){
    for (var i in dataList){
        var data = dataList[i];
        if(typeof(data) == 'string'){
            dataList[i] = 0;
        } 
    }
    return dataList;
}
