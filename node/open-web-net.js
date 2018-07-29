

// ###########
// # Imports #
// ###########

const LOGGER = require('simple-node-logger').createSimpleLogger({
	timestampFormat : 'YYYY-MM-DD HH:mm:ss'
});
LOGGER.setLevel(process.env.LOG_LEVEL);

// #############
// # Constants #
// #############

const MESSAGE_BEGIN = '*'
const MESSAGE_END = '##'

const MESSAGE_ACK = MESSAGE_BEGIN + '#*1' + MESSAGE_END
const MESSAGE_NACK = MESSAGE_BEGIN + '#*0' + MESSAGE_END
const MESSAGE_NORMAL = MESSAGE_BEGIN + 'WHO*WHAT*WHERE' + MESSAGE_END
const MESSAGE_STATUS_REQUEST = MESSAGE_BEGIN + '#WHO*WHERE' + MESSAGE_END
const MESSAGE_DIMENSION_REQUEST = MESSAGE_BEGIN + '#WHO*WHERE*DIMENSION' + MESSAGE_END
const MESSAGE_DIMENSION_WRITING = MESSAGE_BEGIN + '#WHO*WHERE*#DIMENSION*VAL1*...*VALN' + MESSAGE_END

const TAG_WHO = ''
//  0 - Scenario
//  1 - Light
//  2 - Automation
//  4 - Thermoregulation
//  5 - Alarm
//  7 - Video
// 13 - Gateway
// 15 - CEN
// 17 - Scenes
// 18 - Energy
// 22 - Sound
// 24 - Light management
// 25 - CEN+ / Dry contact
const TAG_WHAT = 'WHAT#PAR1#PAR2#...#PARN'
const TAG_WHERE = 'WHERE#PAR1#PAR2#...#PARN'

// ##############
// # Translator #
// ##############

// Documentation : https://www.myopen-legrandgroup.com/developers/
class Translator {

	constructor() {
		this.translators = {
			1: this.light,
			2: this.automation,
			4: this.thermoregulation,
			18: this.energy
		}
	}

	toJson(data) {
		let who = data.match(/^\*[#]?([0-9]+)\*([0-9*#])*##$/)[1];
		let translator = this.translators[who];
		if (translator) {
			translator(data);
		} else {
			LOGGER.warn("[OpWeNe] Translator not found : " + data);
		}
	}

	light(data) {
		LOGGER.debug("[OpWeNe] Handling light : " + data);
	}

	automation(data) {
		LOGGER.debug("[OpWeNe] Handling automation : " + data);
	}

	thermoregulation(data) {
		LOGGER.debug("[OpWeNe] Handling thermoregulation : " + data);
	}

	energy(data) {
		LOGGER.trace("[OpWeNe] Handling energy : " + data);
	}

}

// ##########
// # Export #
// ##########

exports.Translator = Translator;
