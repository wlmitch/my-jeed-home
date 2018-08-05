

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
		let result = {
			who: who
		};
		if (translator) {
			return translator(data, result);
		} else {
			LOGGER.warn("[OpWeNe] Translator not found : " + data);
		}
		return result;
	}

	light(data, result) {
		LOGGER.debug("[OpWeNe] Handling light : " + data);
		let tab = data.split(/\*|#/);
		if (tab[1] == 1) {
			// Status
			// *1*<what>*<where>##
			result['what'] = tab[2]; // 0 : Off, 1 : On
			result['where'] = tab[3];
		} else if (tab[2] == 1 && tab[4] == 1) {
			// Intensity
			// *#1*<where>*1*<level>*<speed>##
			LOGGER.debug("[OpWeNe] Light translator intensity not translated : " + data);
		} else if (tab[2] == 1 && tab[4] == 2) {
			// Temporization
			// *#1*<where>*2*<hour>*<min>*<sec>##
			LOGGER.debug("[OpWeNe] Light translator temporization not translated : " + data);
		} else {
			LOGGER.warn("[OpWeNe] Light translator not found : " + data);
		}
	}

	automation(data, result) {
		LOGGER.debug("[OpWeNe] Handling automation : " + data);
		let tab = data.split(/\*|#/);
		if (tab[1] == 2) {
			// Status
			// *2*<what>*<where>##
			result['what'] = tab[2]; // 0 : Stop, 1 : Up, 2 : Down
			result['where'] = tab[3];
		} else {
			LOGGER.warn("[OpWeNe] Automation translator not found : " + data);
		}
	}

	thermoregulation(data, result) {
		LOGGER.debug("[OpWeNe] Handling thermoregulation : " + data);
	}

	energy(data, result) {
		LOGGER.trace("[OpWeNe] Handling energy : " + data);
		result['ignore'] = true;
	}

}

// ##########
// # Export #
// ##########

exports.Translator = Translator;
