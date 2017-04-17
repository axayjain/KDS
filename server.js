var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/kitchen';
var checkData = [{
        "id": "1",
        "graName": "Amit",
        "isCheckReady": false,
        "seatNumber": "c1",
        "audiNumber": "Audi 1",
        "timerSecond": 0,
        "timerMinute": 0,
        "timeStampMinute": 0,
        "timeStampSecond": 0,
        "items": [{
                "id": "1",
                "posId": "KITCHEN",
                "itemName": "Samosa",
                "isDone": false,
                "isCanceled": true,
                "quantity": "1"
            },
            {
                "id": "2",
                "posId": "CANDY",
                "itemName": "sweet",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "3",
                "posId": "SUSHI",
                "itemName": "Burger",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "4",
                "posId": "KITCHEN",
                "itemName": "xyz",
                "isDone": false,
                "isCanceled": false,
                "quantity": "3"
            },
            {
                "id": "5",
                "posId": "CANDY",
                "itemName": "candy bar",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "6",
                "posId": "SUSHI",
                "itemName": "chips",
                "isDone": false,
                "isCanceled": false,
                "quantity": "3"
            },
            {
                "id": "7",
                "posId": "KITCHEN",
                "itemName": "qwerty",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "8",
                "posId": "CANDY",
                "itemName": "qazxsw",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "9",
                "posId": "SUSHI",
                "itemName": "vvvvv",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            }
        ]
    },
    {
        "id": "2",
        "graName": "Sumit",
        "isCheckReady": false,
        "seatNumber": "c2",
        "audiNumber": "Audi 2",
        "timerSecond": 0,
        "timerMinute": 0,
        "timeStampMinute": 0,
        "timeStampSecond": 0,
        "items": [{
                "id": "1",
                "posId": "KITCHEN",
                "itemName": "Pizza",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "2",
                "posId": "SUSHI",
                "itemName": "Popcorn",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "3",
                "posId": "CANDY",
                "itemName": "Tea",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "4",
                "posId": "KITCHEN",
                "itemName": "Kathi roll",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "5",
                "posId": "SUSHI",
                "itemName": "macroni",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "6",
                "posId": "CANDY",
                "itemName": "flurry",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "7",
                "posId": "SUSHI",
                "itemName": "plplp",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "8",
                "posId": "SUSHI",
                "itemName": "salad",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "9",
                "posId": "CANDY",
                "itemName": "lpop",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            }
        ]
    },
    {
        "id": "3",
        "graName": "Rishab",
        "isCheckReady": false,
        "seatNumber": "c3",
        "audiNumber": "Audi 3",
        "timerSecond": 0,
        "timerMinute": 0,
        "timeStampMinute": 0,
        "timeStampSecond": 0,
        "items": [{
                "id": "1",
                "posId": "KITCHEN",
                "itemName": "kachori",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "2",
                "posId": "CANDY",
                "itemName": "sugar candy",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            },
            {
                "id": "3",
                "posId": "SUSHI",
                "itemName": "grill sandwitch",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "4",
                "posId": "KITCHEN",
                "itemName": "Toamto soup",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "5",
                "posId": "CANDY",
                "itemName": "Ice Cream",
                "isDone": false,
                "isCanceled": false,
                "quantity": "1"
            },
            {
                "id": "6",
                "posId": "SUSHI",
                "itemName": "Lemonade",
                "isDone": false,
                "isCanceled": false,
                "quantity": "2"
            }
        ]
    }
];
var id = 0;
var fetchedData = [];

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

app.get('/takeOrder', function (req, res) {
    res.sendFile(__dirname + '/view/menu.html');
})

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {
    console.log("user connected");

    app.post('/getCheck', function (req, res) {
        var checkData = req.body;
        //console.log(checkData.selectedItems);
        //console.log("'middleware to server'")
        var check = {
            "id": ++id,
            "graName": checkData.graName,
            "isCheckReady": false,
            "seatNumber": "c" + parseInt(id),
            "audiNumber": "Audi " + parseInt(id),
            "timerSecond": 0,
            "timerMinute": 0,
            "timeStampMinute": 0,
            "timeStampSecond": 0,
            "items": checkData.selectedItems
        }
        MongoClient.connect(url, function (err, db) {
            insertDoc(db, function () {
                socket.broadcast.emit('sendSelected', check);
                res.json(check);
                db.close();
            })
        });
        var insertDoc = function (db, callback) {
            db.collection('checks').insert(check, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the checks collection.");
                callback();
            });
        };

    })

    app.post('/searchCheck', function (req, res) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            db.collection('checks').findOne({
                "id": parseInt(req.body.text)
            }, function (err, doc) {
                //console.log(doc);
                //socket.emit('search', doc);
                res.json(doc);
            });
            db.close();
        })
    })

    app.post('/cancelItem', function (req, res) {
        console.log(req.body.dataItem);
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            cancel(db, function () {
                socket.broadcast.emit('refreshChecks', req.body.searchedCheck);
                db.close();
            })
        })
        var cancel = function (db, callback) {
            db.collection('checks').update({
                id: req.body.searchedCheck.id,
                "items.id": req.body.dataItem.id
            }, {
                $set: {
                    "items.$.isCanceled": true
                }
            })
            callback();
        }
    })

    app.post('/unCancelItem', function (req, res) {
        console.log(req.body.dataItem);
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            cancel(db, function () {
                socket.broadcast.emit('refreshChecks', req.body.searchedCheck);
                db.close();
            })
        })
        var cancel = function (db, callback) {
            db.collection('checks').update({
                id: req.body.searchedCheck.id,
                "items.id": req.body.dataItem.id
            }, {
                $set: {
                    "items.$.isCanceled": false
                }
            })
            callback();
        }
    })

    app.post('/updateCheckItems', function (req, res) {
        //console.log(req.body.item);
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            updateCheckItem(db, function () {
                db.close();
            });
        });
        var updateCheckItem = function (db, callback) {
            db.collection('checks').update({
                id: req.body.check.id,
                "items.id": req.body.item.id
            }, {
                $set: {
                    "items.$.isDone": true
                }
            });
            callback();
        };
    })

    app.post('/updateCheck', function (req, res) {
        //console.log(req.body);
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            updateCheck(db, function () {
                db.close();
            })
        })
        var updateCheck = function (db, callback) {
            db.collection('checks').update({
                id: req.body.check.id
            }, {
                $set: {
                    "isCheckReady": req.body.check.isCheckReady,
                    "timeStampMinute": req.body.minute,
                    "timeStampSecond": req.body.second
                }
            })
        }
    })

    app.post('/getMenu', function (req, res) {
        // console.log('runs');
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            db.collection('menu').find({}).toArray(function (err, doc) {
                // console.log(doc);
                res.json(doc);
            })
        });
    })
    MongoClient.connect(url, function (err, db) {

        assert.equal(null, err);
        findDocument(db, function () {
            db.close();
        });
    });

    var findDocument = function (db, callback) {
        var check = db.collection('checks').find();
        check.each(function (err, data) {
            if (data) {
                socket.emit('sendData', data);
            }
            var y = db.collection('checks').find().limit(1).sort({
                $natural: -1
            });
            y.each(function (err, data) {
                if (data) {
                    id = data.id;
                }
            })
            callback();
        })
    }

    socket.on('addQuantity', function (check, item) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            addItemQ(db, function () {
                socket.broadcast.emit('refreshChecks', check);
                db.close();
            })
        })
        var addItemQ = function (db, callback) {
            db.collection('checks').update({
                id: check.id,
                "items.id": item.id
            }, {
                $set: {
                    "items.$.quantity": parseInt(item.quantity)
                }
            })
            callback();
        }
    })

    socket.on('subQuantity', function (check, item) {
        //console.log("minus");
        MongoClient.connect(url, function (err, db) {
            assert.equal(err, null);
            subItemQ(db, function () {
                socket.broadcast.emit('refreshChecks', check);
                db.close();
            })
        })
        var subItemQ = function (db, callback) {
            db.collection('checks').update({
                id: check.id,
                "items.id": item.id
            }, {
                $set: {
                    "items.$.quantity": parseInt(item.quantity)
                }
            })
            callback();
        }
    })


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
})

http.listen(3000, function () {
    console.log('listening on *3000');
});