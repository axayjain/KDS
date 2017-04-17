var socket = io();
var isHistory = false;
$(document).ready(function () {
    makeTemplates();

    //helper function for{{on ~doSomething}}
    var helpers = {
        filter: 'KITCHEN',
        selectItem: selectItem,
        ready: ready
    }

    var kitchenHelper = {
        selectKitchen: selectKitchen
    }

    function ready(ev, eventArgs) {
        var dataItem = $.view(ev.target).data;
        for (var i = 0; i < dataItem.items.length; i++) {
            if (dataItem.items[i].posId == helpers.filter) {
                $.observable(dataItem.items[i]).setProperty("isDone", true);
                var jsonData = {
                    check: dataItem,
                    item: dataItem.items[i]
                }
                updateCheckItems.postUpdate(jsonData, function () {
                    // callback on item ready
                });
                //socket.emit('updateCheckItems', dataItem, dataItem.items[i]);
            }
        }
        $.observable(dataItem).setProperty('isCheckReady', true);
        var jsonDataCheck = {
            check: dataItem,
            minute: dataItem.timerMinute,
            second: dataItem.timerSecond

        }
        readyCheck.postReady(jsonDataCheck, function () {
            // callback on item ready
        });
        //socket.emit('updateCheck', dataItem, dataItem.timerMinute, dataItem.timerSecond);
        updateItems();
        updateKots();
        updateCheck();
        //console.log(dataItem.items);
    }

    //for selecting the completed items
    function selectItem(ev, eventArgs) {
        var dataItem = $.view(ev.target).data;
        console.log(dataItem);
        //get all items in same check
        var arr = $.view(ev.target).get("array").data;
        var cls = $(ev.target).attr("class");
        var index = $.view(ev.target).getIndex();
        //get index of the check
        var parentIndex = $.view(ev.target).get("array").parent.getIndex();
        var jsonData = {
            check: checkData[parentIndex],
            item: dataItem
        }
        updateCheckItems.postUpdate(jsonData, function () {
            // callback on item ready
        });

        //socket.emit('updateCheckItems', checkData[parentIndex], dataItem);
        obsr(dataItem, '', 'isDone', true);
        var counter = 0;
        //check if the items in the array with same kitchen are all checked or not
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].posId == helpers.filter && arr[i].isDone == false) {
                //count only if items are not canceled
                if (!arr[i].isCanceled) {
                    counter++;
                }
            }
        }
        if (counter == 0) {
            //update db

            var jsonDataCheck = {
                check: checkData[parentIndex],
                minute: checkData[parentIndex].timerMinute,
                second: checkData[parentIndex].timerSecond

            }
            readyCheck.postReady(jsonDataCheck, function () {
                // callback on item ready
            });

            //socket.emit('updateCheck', checkData[parentIndex], checkData[parentIndex].timerMinute, checkData[parentIndex].timerSecond);
            //set item ready time on check in history
            obsr(checkData[parentIndex], '', 'timeStampMinute', checkData[parentIndex].timerMinute);
            obsr(checkData[parentIndex], '', 'timeStampSecond', checkData[parentIndex].timerSecond);
            //move check to history on complete
            obsr(checkData[parentIndex], '', 'isCheckReady', true);
            updateKots();
        }
        updateItems();
    }
    //select kitchen from kitchen, sushi and candy
    function selectKitchen(ev, eventArgs) {
        var dataItem = $.view(ev.target).data;
        //console.log(dataItem.name);
        isHistory = false;
        obsr(helpers, '', 'filter', dataItem.name);
        //console.log(helpers.filter);
        //update check status, kots and items on selecting kitchen
        updateCheck();
        updateKots();
        updateItems();
        kitchenScreen.show();
        //change in css properties
        $('.mealCategory .selectedCategory').html(dataItem.name);
        $('.kots').show();
        $('.items').show();
        $('.history .fa-history').css("color", "#ecf0f1");
    }

    //link templates
    rb('.kots .kotContainer', 'kot', bill);
    rb('.items .itemContainer', 'item', bill);
    rb('.categoryContainer', 'kitchens', category, kitchenHelper);

    var kitchenScreen = new function () {
        this.show = function () {
            rb('.checksContainer', 'check', checkData, helpers);
        }
    }
    kitchenScreen.show();

    socket.on('sendSelected', function (data) {
        $.observable(checkData).insert(data);
        //kitchenScreen.show();
        updateCheck();
        updateKots();
        updateItems();
    })
    socket.on('refreshChecks', function (data) {
        for (var i = 0; i < checkData.length; i++) {
            if (checkData[i].id == data.id) {
                for (var j = 0; j < checkData[i].items.length; j++) {
                    $.observable(checkData[i].items[j]).setProperty("isCanceled", data.items[j].isCanceled);
                    $.observable(checkData[i].items[j]).setProperty("quantity", data.items[j].quantity);
                }
                break;
            }
        }
        updateCheck();
        updateKots();
        updateItems();
    })

    socket.on('sendData', function (data) {
        console.log("workingggg");
        $.observable(checkData).insert(data);
        //kitchenScreen.show();
        updateCheck();
        updateKots();
        updateItems();
    })

    var historyScreen = new function () {
        this.show = function () {
            rb('.checksContainer', 'checkHistory', checkData, helpers);
        }
    }

    bind('.history', function () {
        isHistory = true;
        updateCheck();
        historyScreen.show();
        $('.kots').hide();
        $('.items').hide();
        $('.history .fa-history').css("color", "#1E824C");
    })

    //container to access kitchens
    bind('.mealCategory .selectedCategory', function () {
        if ($('.categoryContainer').css('display') == 'none') {
            $('.categoryContainer').show();
        } else {
            $('.categoryContainer').hide();
        }
    })

    //addd new data into main data
    bind('.pvrLogo', function () {
        create();
    })
    //create new check
    function create() {
        var newData = {
            "id": "4",
            "graName": "Ravi",
            "isCheckReady": false,
            "seatNumber": "c4",
            "audiNumber": "Audi 4",
            "timerSecond": 0,
            "timerMinute": 0,
            "timeStampMinute": 0,
            "timeStampSecond": 0,
            "items": [{
                    "posId": "KITCHEN",
                    "itemName": "Pasta",
                    "isDone": false,
                    "isCanceled": false,
                    "quantity": "2"
                },
                {
                    "posId": "KITCHEN",
                    "itemName": "Macroni",
                    "isDone": false,
                    "isCanceled": true,
                    "quantity": "1"
                },
                {
                    "posId": "SUSHI",
                    "itemName": "Corn",
                    "isDone": false,
                    "isCanceled": false,
                    "quantity": "2"
                },
                {
                    "posId": "CANDY",
                    "itemName": "Rolls",
                    "isDone": false,
                    "isCanceled": false,
                    "quantity": "2"
                }
            ]
        }
        var itemsAdded = 0;
        var kotNumbers = 0;
        for (var i = 0; i < newData.items.length; i++) {
            itemsAdded += parseInt(newData.items[i].quantity);
        }
        $.observable(checkData).insert(newData);
        for (var i = 0; i < checkData.length; i++) {
            if (checkData[i].isCheckReady == false) {
                kotNumbers++;
            }
        }
        updateKots();
        updateItems();
    }
    //observe function
    function obsr(data, operation, property, newValue) {
        $.observable(data).setProperty(property, newValue);
    }

    //update functions
    //updating all other kitchens check Status so that if their items are false it could be seen on their screen
    function updateCheck() {
        var checkDone;
        var temp;
        for (var i = 0; i < checkData.length; i++) {
            temp = 0;
            for (var k = 0; k < checkData[i].items.length; k++) {
                if (checkData[i].items[k].posId == helpers.filter) {
                    temp++;
                }
            }
            if (temp > 0) {
                checkDone = 0;
                for (var j = 0; j < checkData[i].items.length; j++) {
                    if (checkData[i].items[j].isDone == false && checkData[i].items[j].posId == helpers.filter && checkData[i].items[j].isCanceled == false) {
                        checkDone = 1;
                        break;
                    }
                }
                if (checkDone == 1) {
                    obsr(checkData[i], '', 'isCheckReady', false);
                    //console.log(checkData[i].isCheckReady);
                    //socket.emit('updateCheck', checkData[i], checkData[i].timerMinute, checkData[i].timerSecond);
                } else {
                    obsr(checkData[i], '', 'isCheckReady', true);
                    //console.log(checkData[i].isCheckReady);
                    //socket.emit('updateCheck', checkData[i], checkData[i].timerMinute, checkData[i].timerSecond);
                }
                var jsonDataCheck = {
                    check: checkData[i],
                    minute: checkData[i].timerMinute,
                    second: checkData[i].timerSecond

                }
                readyCheck.postReady(jsonDataCheck, function () {
                    // callback on item ready
                });
            } else {
                if (isHistory == true) {
                    obsr(checkData[i], '', 'isCheckReady', false);
                    socket.emit('updateCheck', checkData[i], checkData[i].timerMinute, checkData[i].timerSecond);
                } else {
                    obsr(checkData[i], '', 'isCheckReady', true);
                    socket.emit('updateCheck', checkData[i], checkData[i].timerMinute, checkData[i].timerSecond);
                }
            }
        }
    }

    function updateKots() {
        var kotNumbers = 0;
        for (var i = 0; i < checkData.length; i++) {
            if (checkData[i].isCheckReady == false) {
                kotNumbers++;
            }
        }
        obsr(bill, '', 'kotNum', kotNumbers);
    }

    function updateItems() {
        var itemsNum = 0;
        for (var i = 0; i < checkData.length; i++) {
            for (var j = 0; j < checkData[i].items.length; j++) {
                if (checkData[i].items[j].posId == helpers.filter && checkData[i].items[j].isDone == false && checkData[i].items[j].isCanceled == false) {
                    itemsNum += parseInt(checkData[i].items[j].quantity);
                }
            }
        }
        obsr(bill, '', 'itemsNum', itemsNum);
    }

    //check timer
    window.setInterval(function () {
        for (var i = 0; i < checkData.length; i++) {
            if (checkData[i].timerSecond == 59) {
                obsr(checkData[i], '', 'timerMinute', checkData[i].timerMinute + parseInt(1));
                obsr(checkData[i], '', 'timerSecond', 0);
            } else {
                obsr(checkData[i], '', 'timerSecond', checkData[i].timerSecond + parseInt(1));
            }
        }
    }, 1000);

});