

// ###########
// # Imports #
// ###########

const LOGGER = require('simple-node-logger').createSimpleLogger({
	timestampFormat : 'YYYY-MM-DD HH:mm:ss'
});
LOGGER.setLevel(process.env.LOG_LEVEL);

// ##############
// # Translator #
// ##############

// Documentation : https://www.myopen-legrandgroup.com/developers/
// ACK : *#*1##
// NACK : *#*0##
// STATUS_REQUEST : *#<who>*<where>#<par_1>#...#<par_n>##
// STATUS_RESPONSE : *<who>*<what>#<par_1>#...#<par_n>*<where>#<par_1>#...#<par_n>##
// DIMENSION_REQUEST : *#<who>*<where>#<par_1>#...#<par_n>*<dimension>##
// DIMENSION_WRITING : *#<who>*<where>#<par_1>#...#<par_n>*#<dimension>*<val_1>*...*<val_n>##
// DIMENSION_RESPONSE : *#<who>*<where>#<par_1>#...#<par_n>*<dimension>*<val_1>*...*<val_n>##

class Translator {

	constructor() {
		this.translators = {
			//  0 - Scenario
			//  1 - Light
			2: this.automation, // Automation
			13: this.ignore, // Gateway
			//  4 - Thermoregulation
			//  5 - Alarm
			//  7 - Video
			// 15 - CEN
			// 17 - Scenes
			18: this.ignore, // Energy
			// 22 - Sound
			// 24 - Light management
			// 25 - CEN+ / Dry contact
			1022: this.ignore // ???
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
