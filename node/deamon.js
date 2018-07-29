const argv = require('minimist')(process.argv, {
	default: {
		serverPort: 55006,
		gatewayPort: 20000,
		gatewayAddress: '192.168.1.35',
		gatewayPassword: '12345'
	}
});
if (argv.level) {
	process.env.LOG_LEVEL = argv.level;
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
		this.gateway.on('event', (data) => this.processEvent(data));
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

	processEvent(data) {
		LOGGER.trace('[DAEMON] Event : ' + data);
		translator.toJson(data);
	}

	stop() {
		LOGGER.info('[DEAMON] Shutting down');
		this.server.close();
		this.gateway.close();
	}

}

let deamon = new Deamon();
deamon.start();
