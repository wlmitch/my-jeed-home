const argv = require('minimist')(process.argv, {
	default: {
		serverPort: 55006,
		gatewayPort: 20000,
		gatewayAddress: '192.168.1.35',
		gatewayPassword: '12345',
		apiAddress: '127.0.0.1',
		apiKey: '000000',
		disableRequest: false
	}
});
if (argv.logLevel) {
	process.env.LOG_LEVEL = argv.logLevel;
} else {
	process.env.LOG_LEVEL = 'debug';
}

/////////////
// Imports //
/////////////

const net = require('net');
const request = require('request');
const myHome = require('./my-home');
const OpenWebNet = require('./open-web-net');

const LOGGER = require('simple-node-logger').createSimpleLogger({
	timestampFormat : 'YYYY-MM-DD HH:mm:ss'
})
LOGGER.setLevel(process.env.LOG_LEVEL);

///////////////
// Constants //
///////////////

////////////
// Config //
////////////

LOGGER.trace('[DEAMON] Configuration');
LOGGER.trace(argv);

let translator = new OpenWebNet.Translator();

////////////
// Server //
////////////

class Deamon {

	constructor() {
		this.timeouts = {};
	}

	start() {
		this.startServer();
		this.startGateway();
	}

	startServer() {
		LOGGER.debug('[DEAMON] Starting server');
		this.server = net.createServer();
		this.server.on('listening', () => LOGGER.info('[DEAMON] Server bound'))
		this.server.on('connection', (socket) => {
			LOGGER.debug('[DEAMON] Client connected');
			socket.on('data', (buffer) => {
				socket.end();

				if (buffer.equals(Buffer.from('shutdown'))) {
					this.stop();
				} else {
					this.process(JSON.parse(buffer));
				}
			})
		})
		this.server.on('error', (error) => {
			LOGGER.error('[DEAMON] Server error');
			LOGGER.error(error);
		})
		this.server.on('close', () => LOGGER.debug('[DEAMON] Server closed'));
		this.server.listen(argv['serverPort'], '127.0.0.1');
	}

	startGateway() {
		LOGGER.debug('[DEAMON] Starting gateway');
		let gatewayConfig = new myHome.GatewayConfig(argv['gatewayPort'], argv['gatewayAddress'], argv['gatewayPassword']);
		this.gateway = new myHome.Gateway(gatewayConfig);
		this.gateway.on('event', (data) => this.processEventAsync(data));
		this.gateway.on('error', (message) => {
			LOGGER.debug('[DEAMON] Gateway error : ' + message);
			this.stop();
		});
		this.gateway.open();
	}

	process(data) {
		LOGGER.debug('[DEAMON] Data received');
		LOGGER.debug(data);

		if (data.command) {
			LOGGER.debug('[DAEMON] Handling command');
			this.gateway.send(data.command);
		}
	}

	processEventAsync(data) {
		// delay to avoid missing I/O
		setTimeout(() => this.processEvent(data), 0);
	}

	processEvent(data) {
		LOGGER.debug('[DAEMON] Event : ' + data);
		let body = translator.toJson(data);
		if (body.ignore) {
			return;
		}
		if (argv['disableRequest']) {
			return;
		}
		this.processRequest(body);
	}

	processRequest(body) {
		this.scheduleShutterRequests(body);

		request(
			{
				method: 'POST',
				url: 'http://' + argv['apiAddress'] + '/plugins/mjh/core/php/mjh.php?apiKey=' + argv['apiKey'],
				json: true,
				body: body
			},
			(error, response, body) => {
				if(!error && response.statusCode == 200) {
					LOGGER.trace('[DAEMON] Jeedom respond OK');
				} else {
					LOGGER.error('[DEAMON] Jeedom response : ' + response.statusCode + ' : ' + error);
				}
			}
		);
	}

	scheduleShutterRequests(body) {
		if (body.who == 2) {
			if (body.what == 0) { // stop
				LOGGER.debug('[DAEMON] clear timeout : ' + this.timeouts[body.where]);
				clearTimeout(this.timeouts[body.where]);
				delete this.timeouts[body.where];
			} else if (body.what == 1 || body.what == 2) { // up || down
				this.timeouts[body.where] = setTimeout(() => this.processRequest(body), 500);
				LOGGER.debug('[DAEMON] set timeout : ' + this.timeouts[body.where]);
			}
		}
	}

	stop() {
		LOGGER.info('[DEAMON] Shutting down');
		this.server.close();
		this.gateway.close();
	}

}

let deamon = new Deamon();
deamon.start();
