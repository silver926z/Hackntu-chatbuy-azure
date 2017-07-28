var restify = require('restify');
var builder = require('botbuilder');
var https = require('https');
var fs = require('fs');
var PythonShell = require('python-shell');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: 'a5835b16-d536-403a-810f-19c389187e16',
    appPassword: 'oULbSQdXgcHdbNmajnbwsSQ'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    //...Default dialog waterfall steps...
    function (session) {
        // session.send("Hi! record your voice!!")
        builder.Prompts.attachment(session, "Hi! record your voice for logging!")
    },
    function (session, results) {
        if (results.response) {
            console.log('response url %s', results.response[0].contentUrl)
            attachment = results.response[0]
            console.log('response type %s', attachment.contentType)
            console.log('response url %s', attachment.contentUrl)
            console.log('response name %s', attachment.name)
            var file = fs.createWriteStream("voice_reconginize/test_data/ChunLin.mp3");
            var request = https.get(attachment.contentUrl, function (response) {
                response.pipe(file);
            });


            // var options = {
            //     mode: 'text',
            //     pythonPath: '/usr/local/bin/python',
            //     pythonOptions: [''],
            //     scriptPath: '/Users/mac/Documents/chatbuy-azure/voice_reconginize/libsvm-3.22/python',
            //     args: ['ChunLin', '/Users/mac/Documents/chatbuy-azure/voice_reconginize/test_data/ChunLin.mp3']
            // };

            // PythonShell.run('hackTest.py', options, function (err, results) {
            //     if (err) throw err;
            //     // results is an array consisting of messages collected during execution 
            //     console.log('results: %j', results);
            // });

            PythonShell.run('hello.py', function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution 
                console.log('results: %j', results);
            })


            session.send({
                text: "You sent:",
                attachments: [{
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }]
            });
        } else {
            session.send("something wrong!!");
        }

        builder.Prompts.text(session, "What stuffs do you want to buy?");
    },
    function (session, results) {
        console.log(results.response);
        session.send("you want %s", results.response);
    }

]);

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
        .title("Classic White T-Shirt")
        .subtitle("100% Soft and Luxurious Cotton")
        .text("Price is $25 and carried in sizes (S, M, L, and XL)")
        .images([builder.CardImage.create(session, 'https://g-search1.alicdn.com/bao/uploaded/i4/2637669932/TB2UGt8cbXlpuFjy1zbXXb_qpXa_!!2637669932.jpg_240x240q50')])
        .buttons([
            builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
        ]),
        new builder.HeroCard(session)
        .title("Classic Gray T-Shirt")
        .subtitle("100% Soft and Luxurious Cotton")
        .text("Price is $25 and carried in sizes (S, M, L, and XL)")
        .images([builder.CardImage.create(session, 'http://www.happybai.com/img/upload/happybai/product/armani-clothes-0806-10_3457541_1444573797364.jpg')])
        .buttons([
            builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
        ]),
        new builder.HeroCard(session)
        .title("Classic Gray T-Shirt")
        .subtitle("100% Soft and Luxurious Cotton")
        .text("Price is $25 and carried in sizes (S, M, L, and XL)")
        .images([builder.CardImage.create(session, 'https://cdn02.pinkoi.com/product/1zMLd5oc/0/500x0.jpg')])
        .buttons([
            builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
        ]),
        new builder.HeroCard(session)
        .title("Classic Blue T-Shirt")
        .subtitle("100% Soft and Luxurious Cotton")
        .text("Price is $25 and carried in sizes (S, M, L, and XL)")
        .images([builder.CardImage.create(session, 'http://www.inif.com.tw/product/image/pics/1inif印衣服-一件也能印，T恤、POLO衫、團體服運動服.bmp')])
        .buttons([
            builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
        ])


    ]);
    session.send(msg).endDialog();
}).triggerAction({
    matches: /^(clothes|list)/i
});