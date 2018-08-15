

// ###########
// # Imports #
// ###########

const net = require('net');
const util = require('util');
const EventEmitter = require('events');
const tools = require('./tools');

const LOGGER = require('simple-node-logger').createSimpleLogger({
	timestampFormat : 'YYYY-MM-DD HH:mm:ss'
});
LOGGER.setLevel(process.env.LOG_LEVEL);

// #############
// # Constants #
// #############

const DATA_ACK = '*#*1##';
const DATA_NACK = '*#*0##';

const MESSAGES = {
	MODE_CONFIG: '*99*0##',
	MODE_COMMAND: '*99*9##',
	MODE_EVENT: '*99*1##'
}

const STATUS_DISCONNECTED = 'STATUS_DISCONNECTED';
const STATUS_CONNECTING = 'STATUS_CONNECTING';
const STATUS_AUTHENTICATING = 'STATUS_AUTHENTICATING';
const STATUS_CONNECTED = 'STATUS_CONNECTED';

// #################
// # GatewayConfig #
// #################

class GatewayConfig {

	constructor(port, address, password) {
		this.port = port;
		this.address = address;
		this.password = password;
	}

}

// ###########
// # Gateway #
// ###########

class Gateway extends EventEmitter {

	constructor(config) {
		super();
		this.config = config;
		this.queue = new Array();
	}

	open() {
		LOGGER.debug('[MYHOME] Opening gateway');

		this.eventSocket = new GatewaySocket(this.config, 'MODE_EVENT');
		this.eventSocket.on('connected', () => LOGGER.info('[MYHOME] Gateway opened'));
		this.eventSocket.on('data', (data) => this.emit('event', data));
		this.eventSocket.on('closed', () => LOGGER.info('[MYHOME] Gateway closed'));
		this.eventSocket.on('error', (message) => this.emit('error', message));
		this.eventSocket.open();

		this.timeout = setTimeout(() => {
			LOGGER.debug('[MYHOME] Rebooting event socket');
			this.close();
			this.open();
		}, 1 * 60 * 60 * 1000); // Every hours
	}

	send(command, callback) {
		LOGGER.debug('[MYHOME] Query : ' + command);
		let commandSocket = new GatewaySocket(this.config, 'MODE_COMMAND');
		commandSocket.on('connected', () => commandSocket.write(command));
		commandSocket.on('data', (data) => {
			LOGGER.debug('[MYHOME] Response : ' + data);
			if (callback) {
				callback(data);
			}
			commandSocket.close();
		});
		commandSocket.open();
	}

	close() {
		LOGGER.debug('[MYHOME] Closing gateway');
		this.eventSocket.close();
		clearTimeout(this.timeout);
	}

}

// #################
// # GatewaySocket #
// #################

class GatewaySocket extends EventEmitter {

	constructor(config, mode) {
		super();
		this.status = STATUS_DISCONNECTED;
		this.config = config;
		this.mode = mode;
	}

	open() {
		LOGGER.trace('[MYHOME][' + this.mode + '] Opening socket');

		this.socket = net.connect(this.config.port, this.config.address);
		this.socket.on('data', (buffer) => this.read(buffer));
		this.socket.on('close', () => {
			LOGGER.trace('[MYHOME][' + this.mode + '] Socket closed');
			let previousStatus = this.status;
			this.status = STATUS_DISCONNECTED;
			if (previousStatus == STATUS_CONNECTED) {
				this.emit('closed');
			} else if (previousStatus == STATUS_AUTHENTICATING) {
				this.emit('error', 'authentification error');
			} else {
				this.emit('error', 'unknown error');
			}
		});
		this.socket.on('error', (error) => {
			LOGGER.error('[MYHOME][' + this.mode + '] Socket error');
			LOGGER.error(error);
			this.status = STATUS_DISCONNECTED;
		});
	}

	read(buffer) {
		let data = buffer.toString();
		LOGGER.trace('[MYHOME][' + this.mode + '] Data received : ' + data);

		if (this.status == STATUS_DISCONNECTED) {
			if (data == DATA_ACK) {
				LOGGER.trace('[MYHOME][' + this.mode + '] Connecting');
				this.status = STATUS_CONNECTING;
				this.write(MESSAGES[this.mode]);
			}
		} else if (this.status == STATUS_CONNECTING) {
			if (data == DATA_ACK) {
				LOGGER.trace('[MYHOME][' + this.mode + '] Connected without password');
				this.status = STATUS_CONNECTED;
			} else {
				LOGGER.trace('[MYHOME][' + this.mode + '] Authenticating');
				this.status = STATUS_AUTHENTICATING;

				let salt = data.match(/\*#(\d+)##/)[1];
				let passwordHashed = tools.hash(this.config.password, salt);
				this.write('*#' + passwordHashed + '##');
			}
		} else if (this.status == STATUS_AUTHENTICATING) {
			if (data == DATA_ACK) {
				LOGGER.trace('[MYHOME][' + this.mode + '] Connected');
				this.status = STATUS_CONNECTED;
				this.emit('connected');
			}
		} else if (this.status == STATUS_CONNECTED) {
			LOGGER.trace('[MYHOME][' + this.mode + '] emit data');
			this.emit('data', data);
		} else {
			LOGGER.error('[MYHOME][' + this.mode + '] unknown status : ' + this.status);
		}
	}

	write(command) {
		this.socket.write(command);
		LOGGER.trace('[MYHOME][' + this.mode + '] Data send : ' + command);
	}

	close() {
		this.socket.end();
	}

}

// ##########
// # Export #
// ##########

exports.Gateway = Gateway;
exports.GatewayConfig = GatewayConfig;
