/**
 * Created by lzy on 2017/10/20.
 */
module.exports = {
    "channel":[
        {
            "from":"baidu",
            "name":"civilnews",
            "work":false,       //false 则不抓取
            "title":"百度国内最新新闻",
            "link":"http://news.baidu.com/n?cmd=4&class=civilnews&tn=rss",
            "typeId":1
        },{
            "from":"netEase",
            "name":"rss_gn",
            "title":"网易最新新闻",
            "link":"http://news.163.com/special/00011K6L/rss_gn.xml",
            "typeId":2
        }
    ]
} ;