(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports){
        module.exports = factory();
    } else {
        global.ReconnectingWebSocket = factory();
    }
})(this, function () {

    function ReconnectingWebSocket(url, protocols) {
        console.info('Переподключение web-сокета...');
        protocols = protocols || [];

        // These can be altered by calling code.
        this.debug = true;
        this.reconnectInterval = 5000; //1000
        this.reconnectDecay = 1.5;
        this.reconnectAttempts = 10;
        this.timeoutInterval = 5000; //2000

        var self = this;
        var ws;
        var forcedClose = false;
        var timedOut = false;

        this.url = url;
        this.protocols = protocols;
        this.readyState = WebSocket.CONNECTING;
        this.URL = url; // Public API


        this.onopen = function(event) {
        };

        this.onclose = function(event) {
        };

        this.onconnecting = function(event) {
        };

        this.onmessage = function(event) {
        };

        this.onerror = function(event) {
        };


        function connect(reconnectAttempt) {
            ws = new WebSocket(url);

            if(!reconnectAttempt)
                self.onconnecting();

            if (self.debug || ReconnectingWebSocket.debugAll) {
                console.debug('ReconnectingWebSocket', 'attempt-connect', url);
            }

            var localWs = ws;
            var timeout = setTimeout(function() {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'connection-timeout', url);
                }
                localWs.close();
                timedOut = true;
            }, self.timeoutInterval);

            ws.onopen = function(event) {

                clearTimeout(timeout);
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onopen', url);
                }
                self.readyState = WebSocket.OPEN;
                reconnectAttempt = true;
                self.reconnectAttempts = 10;
                //self.onopen(event);
                $('#waitWs').hide(); // Скрытие ебаного прелоадера!!!
            };
            
            ws.onclose = function(event) {
                clearTimeout(timeout);
                ws = null;
                if (forcedClose) {
                    self.readyState = WebSocket.CLOSED;
                    //self.onclose(event);
                } else {
                    self.readyState = WebSocket.CONNECTING;
                    self.onconnecting();
                    if (!reconnectAttempt && !timedOut) {
                        if (self.debug || ReconnectingWebSocket.debugAll) {
                            console.debug('ReconnectingWebSocket', 'onclose', url);
                        }
                        //self.onclose(event);
                    }
                    setTimeout(function() {
                        self.reconnectAttempts++;
                        connect(true);
                    }, self.reconnectInterval * Math.pow(self.reconnectDecay, self.reconnectAttempts));
                }
            };
            ws.onmessage = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onmessage', url, event.data);
                }
                self.onmessage(event);
            };
            ws.onerror = function(event) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'onerror', url, event);
                }
                self.onerror(event);
            };
        }
        connect(false);

        this.send = function(data) {
            if (ws) {
                if (self.debug || ReconnectingWebSocket.debugAll) {
                    console.debug('ReconnectingWebSocket', 'send', url, data);
                }
                return ws.send(data);
            } else {
                throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
            }
        };

        this.close = function() {
            forcedClose = true;
            if (ws) {
                ws.close();
            }
        };

        this.refresh = function() {
            if (ws) {
                ws.close();
            }
        };
    }

    ReconnectingWebSocket.debugAll = false;

    return ReconnectingWebSocket;
});
