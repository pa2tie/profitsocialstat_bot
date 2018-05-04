const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const async = require('async');
const axios = require('axios');
const FormData = require('form-data');
const puppeteer = require('puppeteer');
var CronJob = require('cron').CronJob;
const xml2csv = require('xml2csv')

var profit_login = process.env.PROFIT_LOGIN;
var profit_pass = process.env.PROFIT_PASSWORD;
var profit_cookies;


const token = process.env.TG_TOKEN;
var chatIdImon = process.env.CHAT_ID;

const bot = new TelegramBot(token, {polling: true});


process.on('uncaughtException', function (err) {
  console.log("Error. Node NOT Exiting...");
});


var dateToday = new Date();
var yearToday = dateToday.getFullYear();
var monthToday = dateToday.getMonth() + 1;
    monthToday = (monthToday < 10 ? "0" : "") + monthToday;
var dayToday  = dateToday.getDate();
    dayToday = (dayToday < 10 ? "0" : "") + dayToday;

var dateYesterday = new Date();
    dateYesterday.setDate(dateToday.getDate() - 1);
var yearYesterday = dateYesterday.getFullYear();
var monthYesterday = dateYesterday.getMonth() + 1;
    monthYesterday = (monthYesterday < 10 ? "0" : "") + monthYesterday;
var dayYesterday  = dateYesterday.getDate();
    dayYesterday = (dayYesterday < 10 ? "0" : "") + dayYesterday;


var urlTodayGeoProfit = `https://profitsocial.com/affiliates/index.php?tr_group_by=country&tr_timeselect=1&tr_timepreset=1&tr_utm_content_comparator=%3D&tr_utm_content=&commited=yes&md=Affiliate_Affiliates_Views_TdsReport&sortby=country_name&sortorder=asc&numrows=100000000&list_page=&tr_advanced_filter_show=&action=export&export=xml`;
var urlYesterdayGeoProfit = `https://profitsocial.com/affiliates/index.php?tr_group_by=country&tr_timeselect=1&tr_timepreset=2&tr_utm_content_comparator=%3D&tr_utm_content=&commited=yes&md=Affiliate_Affiliates_Views_TdsReport&sortby=country_name&sortorder=asc&numrows=100000000&list_page=&tr_advanced_filter_show=&action=export&export=xml`;
var urlTodayProfit = `https://profitsocial.com/affiliates/index.php?tr_group_by=utm_content&tr_timeselect=1&tr_timepreset=1&tr_utm_content_comparator=%3D&tr_utm_content=&commited=yes&md=Affiliate_Affiliates_Views_TdsReport&sortby=utm_content&sortorder=asc&numrows=100000000&list_page=&tr_advanced_filter_show=&action=export&export=xml`;
var urlYesterdayProfit = `https://profitsocial.com/affiliates/index.php?tr_group_by=utm_content&tr_timeselect=1&tr_timepreset=2&tr_utm_content_comparator=%3D&tr_utm_content=&commited=yes&md=Affiliate_Affiliates_Views_TdsReport&sortby=utm_content&sortorder=asc&numrows=100000000&list_page=&tr_advanced_filter_show=&action=export&export=xml`;

var zohoTodayGeoProfit;
var zohoTodayProfit;
var zohoYesterdayGeoProfit;
var zohoYesterdayProfit;
var msgIDProfit = "";

var checkTodayProfit = false;
var checkTodayGeoProfit = false;
var checkYesterdayGeoProfit = false;
var checkYesterdayProfit = false;

new CronJob('0 */30 * * * *', function() { // Every 30 min
  var iter = 0;
  async.doWhilst(
   function(callback2) {

    async.waterfall([
            function(callback) { // Update date

              dateToday = new Date();
              yearToday = dateToday.getFullYear();
              monthToday = dateToday.getMonth() + 1;
              monthToday = (monthToday < 10 ? "0" : "") + monthToday;
              dayToday  = dateToday.getDate();
              dayToday = (dayToday < 10 ? "0" : "") + dayToday;

              dateYesterday = new Date();
              dateYesterday.setDate(dateToday.getDate() - 1);
              yearYesterday = dateYesterday.getFullYear();
              monthYesterday = dateYesterday.getMonth() + 1;
              monthYesterday = (monthYesterday < 10 ? "0" : "") + monthYesterday;
              dayYesterday  = dateYesterday.getDate();
              dayYesterday = (dayYesterday < 10 ? "0" : "") + dayYesterday;

              callback(null);
            },
            function(callback) { // get cookies
              getCookies(function(check) { 
                checkTodayGeoProfit = check;
                checkTodayProfit = check;
                checkYesterdayGeoProfit = check;
                checkYesterdayProfit = check;
                callback(null);
              });
            },
            function(callback) { // Download today stat (GEO)
              var fileName = 'profit_stats_export_geo_today.xml';
              var fileName2 = 'profit_stats_export_geo_today.csv';
              downloadFile(fileName, urlTodayGeoProfit, function(check) { 
                checkTodayGeoProfit = check;
                firstColumn = 'country_name';
                convertXMLtoCSV(fileName, fileName2, firstColumn, function(check1) {
                  checkTodayGeoProfit = check1;
                  callback(null);
                });
                
              });
            },
            function(callback) { // Download today stat
              var fileName = 'profit_stats_export_today.xml';
              var fileName2 = 'profit_stats_export_today.csv';
              downloadFile(fileName, urlTodayProfit, function(check) { 
                checkTodayProfit = check;
                firstColumn = 'utm_content';
                convertXMLtoCSV(fileName, fileName2, firstColumn, function(check1) {
                  checkTodayProfit = check1;
                  callback(null);
                });
              });
            },
            function(callback) { // Download yesterday stat (GEO)

              var fileName = 'profit_stats_export_geo_yesterday.xml';
              var fileName2 = 'profit_stats_export_geo_yesterday.csv';
              downloadFile(fileName, urlYesterdayGeoProfit, function(check) { 
                checkYesterdayGeoProfit = check;
                firstColumn = 'country_name';
                convertXMLtoCSV(fileName, fileName2, firstColumn, function(check1) {
                  checkYesterdayGeoProfit = check1;
                  callback(null);
                });
              });

            },
            function(callback) { // Download yesterday stat

              var fileName = 'profit_stats_export_yesterday.xml';
              var fileName2 = 'profit_stats_export_yesterday.csv';
              downloadFile(fileName, urlYesterdayProfit, function(check) { 
                checkYesterdayProfit = check;
                firstColumn = 'utm_content';
                convertXMLtoCSV(fileName, fileName2, firstColumn, function(check1) {
                  checkYesterdayProfit = check1;
                  callback(null);
                });
      
              });

            },
            function(callback) { // Upload today stat (GEO)
              var fileName = 'profit_stats_export_geo_today.csv';
              uploadZoho(dayToday, monthToday, yearToday, fileName, function(check, zoho) {
                checkTodayGeoProfit = check;
                zohoTodayGeoProfit = zoho;
                callback(null);
              });
            },
            function(callback) { // Upload today stat
              var fileName = 'profit_stats_export_today.csv';
              uploadZoho(dayToday, monthToday, yearToday, fileName, function(check, zoho) {
                checkTodayProfit = check;
                zohoTodayProfit = zoho;
                callback(null);
              });
            },
            function(callback) { // Upload yesterday stat (GEO)

              var fileName = 'profit_stats_export_geo_yesterday.csv';
              uploadZoho(dayYesterday, monthYesterday, yearYesterday, fileName, function(check, zoho) {
                checkYesterdayGeoProfit = check;
                zohoYesterdayGeoProfit = zoho;
                callback(null);
              });

            },
            function(callback) { // Upload yesterday stat

              var fileName = 'profit_stats_export_yesterday.csv';
              uploadZoho(dayYesterday, monthYesterday, yearYesterday, fileName, function(check, zoho) {
                checkYesterdayProfit = check;
                zohoYesterdayProfit = zoho;
                callback(null);
              });

            },
            function(callback) { // Send message
              if (!checkTodayGeoProfit && !checkYesterdayGeoProfit && !checkTodayProfit && !checkYesterdayProfit) {
                var options = {
                  reply_markup: JSON.stringify({
                    inline_keyboard: [
                    [{ text: '💲 ЗА СЕГОДНЯ', url: zohoTodayProfit }],
                    [{ text: '💲 ЗА ВЧЕРА', url: zohoYesterdayProfit }],
                    [{ text: '🔃 ВЫГРУЗКА ГЕО (СЕГОДНЯ)', url: zohoTodayGeoProfit }],
                    [{ text: '🔃 ВЫГРУЗКА ГЕО (ВЧЕРА)', url: zohoYesterdayGeoProfit }]
                    ]
                  })
                };
                if (msgIDProfit != "") {
                  bot.deleteMessage(chatIdImon, msgIDProfit);
                }
                bot.sendMessage(chatIdImon, "✔️СТАТИСТИКА С PS:", options).then(sender => {
                  msgIDProfit = sender.message_id;
                });

                callback(null);
              } else {
                callback(null);
              }

            },
            function(callback) {
             callback(null, 'End');
           }
           ],
           function(err, result) {
            console.log('END POST TODAY STAT Profit');
            iter++;
            callback2();
          });
},
function() {    
 return ((checkTodayProfit || checkYesterdayProfit || checkYesterdayGeoProfit || checkTodayGeoProfit) && (iter < 3)); 
},
function (err, result) {
 console.log('END CYCLE');
}
);

}, null, true, 'Europe/Moscow', null, true);



/* FUNCTIONS */

function getCookies(callback1) {
  (async () => {
    var browser = await puppeteer.launch({
      headless: true,
      args: [
      '--proxy-server="direct://"',
      '--proxy-bypass-list=*',
      '--no-sandbox', 
      '--disable-setuid-sandbox'
      ]
    });
    try {
      var page = await browser.newPage();

      await page.goto('https://profitsocial.com/affiliates/index.php?md=QCore_Login');
      await page.waitForSelector('#username');
      await page.focus('#username');
      await page.type('#username', profit_login);
      await page.focus('#rpassword');
      await page.type('#rpassword', profit_pass);
      await page.click('body > div.page-container > div > div > div > form > div > div:nth-child(5) > button');
      await page.waitForSelector('#balance');

      var c = await page.cookies();
      for (var i = 0; i < c.length; i++) {
        if (c[i].name == "PHPSESSID") {
          profit_cookies = c[i];
        }
      }

      await browser.close();
      await main();
      function main() {
        callback1(false);
      }
    } catch(e) {
      console.log('Error get cookies: ' + e);
      browser.close();
      callback1(true);
    }
  })();
}

function downloadFile(fileName, url, callback1) {

  console.log('Start download');

  if(fs.existsSync(fileName)) {
    fs.unlink(fileName);
  }


  (async () => {
   var browser = await puppeteer.launch({
     headless: true,
     args: [
     '--proxy-server="direct://"',
     '--proxy-bypass-list=*',
     '--no-sandbox', 
     '--disable-setuid-sandbox'
     ]
   });
   try {
     var page = await browser.newPage();
     await page.goto('https://profitsocial.com/affiliates/index.php?md=QCore_Login');
     await page.waitFor('#username');
     var cookies = await page.cookies();
     //await page.deleteCookie(...cookies);
     var c = {
      name: profit_cookies.name,
      value: profit_cookies.value
     }
     await page.setCookie(c);
     //await page.deleteCookie();
     await page.reload();
     await page.waitForSelector('#balance');

     var dataGet = await page.evaluate((url) => {
      var data = [];
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
      xhr.send();
      data.push(xhr.responseText);
      return data;
    }, url);

     await browser.close();
     await main();
     function main() {
      fs.writeFile(fileName, dataGet[0], "binary", function(err, x) {
        console.log('Wrote file');
        callback1(false);
      });
    }
  } catch(e) {
    console.log('Error: ' + e);
    browser.close();
    callback1(true);
  }
})();

}

function convertXMLtoCSV(file1, file2, firstColumn, callback1) {

  if(fs.existsSync(file2)) {
    fs.unlink(file2);
  }

  xml2csv(
    {
      xmlPath: file1,
      csvPath: file2,
      rootXMLElement: 'record',
      headerMap: [
        [firstColumn, firstColumn, 'string'],
        ['visits', 'visits', 'integer'],
        ['leads', 'leads', 'integer'],
        ['hit2lead', 'hit2lead', 'integer'],
        ['ecpm', 'ecpm', 'double'],
        ['revenue', 'revenue', 'double']
      ]
    },
    function (err, info) {
      if (err) {
        callback1(true);
      } else {
        callback1(false);
      }
    }
  );
}


function uploadZoho(day, month, year, fileName, callback1) {

  var form = new FormData();

  form.append('content', fs.createReadStream(fileName), {
    filename: `profit_stats_for_${year}-${month}-${day}.csv`,
    contentType: 'application/vnd.ms-excel'
  });

  form.append('file', 'import');
  form.append('mode', 'url');
  form.append('proxyURL', 'viewer');

  axios.post('https://sheet.zoho.com/sheet/view.do', form, {
    headers: form.getHeaders(),
  }).then(result => {
    console.log(result.data);
    callback1(false, result.data);
  })
  .catch(error => {
    console.error('Upload failed: ' + error);
    callback1(true, "");
  });

}