

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

const MESSAGE_ACK = '*#*1##'
const MESSAGE_NACK = '*#*0##'
//const MESSAGE_STATUS_REQUEST = '*#<who>*<where>##'
const MESSAGE_STATUS = '*<who>*<what>*<where>##'
//const MESSAGE_DIMENSION_REQUEST = '*#<who>*<where>*<dimension>##'
//const MESSAGE_DIMENSION_WRITING = '*#<who>*<where>*#<dimension>*<val_1>*...*<val_n>##'
const MESSAGE_DIMENSION = '*#<who>*<where>*<dimension>*<val_1>*...*<val_n>##'

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
const TAG_WHAT = '<what>#<par_1>#...#<par_n>'
const TAG_WHERE = '<where>#<par_1>#...#<par_n>'

// ##############
// # Translator #
// ##############

// Documentation : https://www.myopen-legrandgroup.com/developers/
class Translator {

	constructor() {
		this.translators = {
			2: this.automation,
			18: this.ignore,
			1022: this.ignore
		}
	}

	toJson(data) {
		let result = this.toResult(data);
		let translator = this.translators[result.who];
		if (translator) {
			translator(result);
		}
		if (result.ignore) {
			LOGGER.trace('[OpWeNe] Result ' + JSON.stringify(result));
		} else {
			LOGGER.debug('[OpWeNe] Result ' + JSON.stringify(result));
		}
		return result;
	}

	toResult(data) {
		if (data.startsWith('*#') && data.endsWith('##')) {
			// *#<who>*<where>#<par_1>#...#<par_n>*<dimension>*<val_1>*...*<val_n>##
			let tab = data.substring(2, data.length - 2).split(/\*/);
			let whereTab = tab[1].split(/#/);
			return {
				who: tab[0],
				where: whereTab[0],
				whereParams: whereTab.slice(1),
				dimension: tab[2],
				dimensionValues: tab.slice(3)
			};
		} else if (data.startsWith('*') && data.endsWith('##')) {
			// *<who>*<what>#<par_1>#...#<par_n>*<where>#<par_1>#...#<par_n>##
			let tab = data.substring(1, data.length - 2).split(/\*/);
			let whatTab = tab[1].split(/#/);
			let whereTab = tab[2].split(/#/);
			return {
				who: tab[0],
				where: whereTab[0],
				whereParams: whereTab.slice(1),
				what: whatTab[0],
				whatParams: whatTab.slice(1)
			};
		} else {
			LOGGER.warn('[OpWeNe] Unknown message : ' + data);
			return {
				ignore: true
			};
		}
	}

	automation(result) {
		if (result.what == 1000) {
			result.ignore = true;
		}
	}

	ignore(result) {
		result.ignore = true;
	}

}

// ##########
// # Export #
// ##########

exports.Translator = Translator;
