var getData = new function () {
    this.reqData = function (emptyJson, cb) {
        execute('getMenu', emptyJson, function (data) {
            cb(data);
        });
    }
}


var addCheck = new function () {
    this.getCheck = function (graItem, cb) {
        execute('getCheck', graItem, function (data) {
            if (data) {
                cb(data);
            }
        });
    }
}

var searchCheck = new function () {
    this.postSearch = function (id, cb) {
        execute('searchCheck', id, function (data) {
            if (data) {
                cb(data);
            } else {
                cb('');
            }
        });
    }
}

var cancelItem = new function () {
    this.postCancel = function (jsonCheck, cb) {
        execute('cancelItem', jsonCheck, function (data) {
            cb(data);
        });
    }
}

var unCancelItem = new function () {
    this.postUnCancel = function (jsonCheck, cb) {
        execute('unCancelItem', jsonCheck, function (data) {
            cb(data);
        });
    }
}

var updateCheckItems = new function () {
    this.postUpdate = function (jsonCheck, cb) {
        execute('updateCheckItems', jsonCheck, function () {
            cb();
        });
    }
}

var readyCheck = new function () {
    this.postReady = function (jsonCheck, cb) {
        execute('updateCheck', jsonCheck, function () {
            cb();
        });
    }
}