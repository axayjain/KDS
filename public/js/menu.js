var socket = io();
var graName = 'GRA';
var emptyJson = {
    "name": "akshay"
};
$(document).ready(function () {

    makeTemplates();
    var itemsDetails = [];
    var coupanCodes = [{
            "code": "12345",
            "discount": "50%",
            "match": false
        },
        {
            "code": "67890",
            "discount": "25%",
            "match": false
        }
    ];
    var searchedCheck = {};
    bill = {
        selectedItems: [],
        itemsDetails: itemsDetails,
        coupanCodes: coupanCodes,
        total: 0
    }
    myHelper = {
        add: add,
        sub: sub,
        cancel: cancel,
        unCanceled: unCanceled
    }

    execute('getMenu', {}, function (data) {
        if (data) {
            bill.itemsDetails = data;
            updateMenu();
        }
    })

    rb('.finalBill', 'totalBill', bill, '');

    function updateMenu() {
        rb('.items', 'items', bill, '', '.addItem', function (cls, data) {
            var dataItems = $.view(cls).data;
            var flag = 0;
            for (var i = 0; i < bill.selectedItems.length; i++) {
                if (dataItems.name == bill.selectedItems[i].name) {
                    flag = 1;
                    break;
                }
            }
            if (flag != 1) {
                $.observable(dataItems).setProperty('quantity', 1);
                $.observable(bill.selectedItems).insert(dataItems);
                $.observable(bill).setProperty('total', bill.total + parseInt(dataItems.price));
            } else {
                $.observable(dataItems).setProperty('quantity', dataItems.quantity + 1);
            }
        });
    }


    function updateBill() {
        rb('.addedItems', 'selected', bill, '', '.fa-plus', function (cls, data) {
            var dataItems = $.view(cls).data;

            $.observable(dataItems).setProperty('quantity', dataItems.quantity + 1);

        }, function () {
            bind('.fa-minus', function () {
                var dataItems = $.view(this).data;
                if (dataItems.quantity > 0) {
                    $.observable(dataItems).setProperty('quantity', dataItems.quantity - 1);
                } else {
                    $.observable(bill.selectedItems).remove(selectedItems.indexOf(dataItems));
                }
            })
        });
    }

    bind('.enterGra', function () {
        var text = $('.inputBox').val();
        $('.inputBox').val('');
        if (text.length > 0) {
            graName = text;
        } else {
            alert("No Code entered");
        }
    })

    bind('.checkOut', function () {
        if (bill.selectedItems.length > 0) {
            //console.log(selectedItems);
            var graItem = {
                selectedItems: bill.selectedItems,
                graName: graName
            }
            //console.log(graItem);
            execute('getCheck', graItem, function () {
                //addCheck callback
                $.observable(bill.selectedItems).remove(0, bill.selectedItems.length);
                $.observable(bill).setProperty('total', 0);
            });
        }
    })

    bind('.clearSearch', function () {
        $('.clearSearch').hide();
        updateBill();
        $('.searchContainer').show();
    })

    bind('.doSearch', function () {
        var text = $('.inputSearch').val();
        if (text.match(/^\d+$/)) {
            $('.inputSearch').val('');
            $('.searchContainer').hide();
            $('.clearSearch').show();
            //socket.emit('search', parseInt(text));
            var id = {
                text: text
            }
            //post search
            searchCheck.postSearch(id, function (data) {
                if (data) {
                    searchedCheck = data;
                    showSearched();
                    //console.log(data);
                } else {
                    alert('invalid check Id');
                }
            });
        } else {
            alert('enter valid value');
        }
    })
    socket.on('search', function (data) {
        if (data) {
            searchedCheck = data;
            showSearched();
            //console.log(data);
        } else {
            alert('invalid check Id');
        }
    })

    function showSearched() {
        rb('.addedItems', 'searchedItems', searchedCheck, myHelper);
    }

    function add(ev, eventsArgs) {
        var dataItem = $.view(ev.target).data;
        $.observable(dataItem).setProperty("quantity", dataItem.quantity + 1);
        socket.emit('addQuantity', searchedCheck, dataItem);


    }

    function sub(ev, eventsArgs) {
        var dataItem = $.view(ev.target).data;
        if (dataItem.quantity > 1) {
            $.observable(dataItem).setProperty("quantity", dataItem.quantity - 1);
            socket.emit('subQuantity', searchedCheck, dataItem);
        }

    }

    function cancel(ev, eventsArgs) {
        //console.log('blah');
        var dataItem = $.view(ev.target).data;
        $.observable(dataItem).setProperty("isCanceled", true);
        var jsonCheck = {
            searchedCheck: searchedCheck,
            dataItem: dataItem
        }
        cancelItem.postCancel(jsonCheck, function (data) {
            //callback from server
        })
        //socket.emit('cancelItem', searchedCheck, dataItem);
    }

    function unCanceled(ev, eventsArgs) {
        var dataItem = $.view(ev.target).data;
        $.observable(dataItem).setProperty("isCanceled", false);
        var jsonCheck = {
            searchedCheck: searchedCheck,
            dataItem: dataItem
        }
        unCancelItem.postUnCancel(jsonCheck, function (data) {
            //callback from server
        })
        //socket.emit('unCancelItem', searchedCheck, dataItem);
    }


    $.observable(bill).observeAll(changeHandler);

    function changeHandler(ev, eventsArgs) {
        if (eventsArgs.change == "insert") {
            updateBill();
        }
        if (eventsArgs.change == "set") {
            if (eventsArgs.path == "quantity") {
                if (eventsArgs.value > eventsArgs.oldValue) {
                    $.observable(bill).setProperty('total', bill.total + parseInt(ev.target.price));
                } else {
                    $.observable(bill).setProperty('total', bill.total - parseInt(ev.target.price));
                }
            }
        }
    }

})