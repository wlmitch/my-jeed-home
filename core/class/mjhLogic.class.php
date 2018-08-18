<?php

class mjh extends eqLogic {

	public static function dependancy_info() {
		$return = array();
		$return['log'] = 'mjh_dep';
		$return['progress_file'] = '/tmp/dependency_mjh_in_progress';

		if (is_dir(realpath(dirname(__FILE__) . '/../../node/node_modules'))) {
			$return['state'] = 'ok';
		} else {
			$return['state'] = 'nok';
		}

		return $return;
	}

	public static function dependancy_install() {
		log::remove(__CLASS__ . '_dep');
		return array(
			'script' => dirname(__FILE__) . '/../../resources/install.sh',
			'log' => log::getPathToLog(__CLASS__ . '_dep')
		);
	}

	public static function deamon_info() {
		$return = array();
		$return['log'] = 'mjh_deamon';
		$return['launchable'] = 'ok';

		$pid = trim(shell_exec('ps ax | grep "mjh/node/deamon.js" | grep -v "grep" | wc -l'));
		if ($pid != '' && $pid != '0') {
			$return['state'] = 'ok';
		} else {
			$return['state'] = 'nok';
		}

		return $return;
	}

	public static function deamon_start($_debug = false) {
		log::add('mjh', 'info', 'Deamon start');

		$path = realpath(dirname(__FILE__) . '/../../node/deamon.js');
		$serverPort = config::byKey('serverPort', 'mjh', 55006);
		$gatewayAddress = config::byKey('gatewayAddress', 'mjh', '192.168.1.35');
		$gatewayPort = config::byKey('gatewayPort', 'mjh', '20000');
		$gatewayPassword = config::byKey('gatewayPassword', 'mjh', '12345');
		$logLevel = log::convertLogLevel(log::getLogLevel('mjh'));
		$cmd = 'nice -n 19 nodejs ' . $path .
				' --logLevel=' . $logLevel .
				' --serverPort=' . $serverPort .
				' --gatewayAddress=' . $gatewayAddress .
				' --gatewayPort=' . $gatewayPort .
				' --gatewayPassword=' . $gatewayPassword .
				' --apiKey=' . jeedom::getApiKey('mjh');
		log::add('mjh', 'debug', $cmd);

		$result = exec('sudo ' . $cmd . ' >> ' . log::getPathToLog('mjh_deamon') . ' 2>&1 &');
		if (strpos(strtolower($result), 'error') !== false || strpos(strtolower($result), 'traceback') !== false) {
			log::add('mjh', 'error', $result);
			return false;
		}

		for ($i = 0; $i < 5; $i++) {
			if (self::deamon_info()['state'] == 'ok') {
				log::add('mjh', 'info', 'Deamon started');
				return true;
			}
			sleep(1);
		}

		log::add('mjh', 'error', 'Unable to launch deamon in time');
		return false;
	}

	public static function deamon_stop() {
		log::add('mjh', 'info', 'Deamon stop');
		mjh::sendToDeamon('shutdown');
	}

	public static function findWhos() {
		$path = dirname(__FILE__) . '/../../config/who';
		$files = ls($path, '*.json', false, array('files', 'quiet'));
		$return = array();
		foreach ($files as $file) {
				$content = mjh::readWhoFile($file);
				if ($content != null) {
					array_push($return, $content);
				}
		}
		return $return;
	}

	public static function readWhoFile($file) {
		$path = dirname(__FILE__) . '/../../config/who';
		try {
			$content = file_get_contents($path . '/' . $file);
			if (is_json($content)) {
				return json_decode($content, true);
			} else {
				return null;
			}
		} catch (Exception $e) {
			log::add('mjh', 'info', 'unable to read who file');
			log::add('mjh', 'info', $e);
		}
	}

	public static function sendCommand($cmd) {
		mjh::sendToDeamon(json_encode(['command' => $cmd]));
	}

	public static function sendToDeamon($data) {
		$socket = socket_create(AF_INET, SOCK_STREAM, 0);
		socket_connect($socket, '127.0.0.1', config::byKey('serverPort', 'mjh', 55006));
		socket_write($socket, $data, strlen($data));
		socket_close($socket);
	}

	public static function processEvent($data) {
		log::add('mjh', 'debug', 'Process event');
		log::add('mjh', 'debug', print_r($data, true));

		$logicalId = $data['who'] . ':' . $data['where'];
		$equipment = mjh::byLogicalId($logicalId, 'mjh');
		if (is_object($equipment)) {
			$equipment->processData($data);
		} else {
			log::add('mjh', 'warning', 'No equipement for id "' . $logicalId . '"');
		}
	}

	public function processData($data) {
		$this->processWhat($data);
		$this->processDimension($data);
	}

	public function processWhat($data) {
		$who = $data['who'];
		$what = $data['what'];
		if ($what != null) {
			$this->updateCommand('what', $this->translate($who, 'what', $what));
			if ($who == 2) {
				$this->handleShutterState();
			}
		}
	}

	public function processDimension($data) {
		$who = $data['who'];
		$dimension = $data['dimension'];
		if ($dimension != null) {
			$values = $data['dimensionValues'];
			for ($i = 0, $count = count($values); $i < $count; $i++) {
				$commandLogicalId = 'dimension_' . $dimension . '_' . $i;
				$value = $this->translate($who, $commandLogicalId, $values[$i]);
				$this->updateCommand($commandLogicalId, $value);
			}
		}
	}

	public function updateCommand($commandLogicalId, $value) {
		$logicalId = $this->getLogicalId();
		if ($this->checkAndUpdateCmd($commandLogicalId, $value, date('Y-m-d H:i:s'))) {
			log::add('mjh', 'debug', '[UPDATE] Equipement "' . $logicalId . '", info "' . $commandLogicalId . '" : "' . $value . '"');
		} else {
			log::add('mjh', 'warning', '[NOT FOUND] Equipement "' . $logicalId . '", info "' . $commandLogicalId . '" : "' . $value . '"');
		}
	}

	public function translate($who, $commandLogicalId, $value) {
		$content = mjh::readWhoFile($who . '.json');
		if ($content != null && $content[$commandLogicalId] != null) {
			return $content[$commandLogicalId][$value];
		} else {
			return $value;
		}
	}

	public function handleShutterState() {
		$whatCommand = $this->getCmd('info', 'what');
		$stateCommand = $this->getCmd('info', 'state');
		$positionCommand = $this->getCmd('info', 'position');

		if (!$stateCommand) {
			log::add('mjh', 'debug', '"state" not found');
			return;
		}
		if (!$positionCommand) {
			log::add('mjh', 'debug', '"position" not found');
			return;
		}

		$duration = $whatCommand->getConfiguration('duration');
		if (!is_numeric($duration)) {
			$duration = 30;
		}

		$previousState = $stateCommand->execCmd(null, 2);
		$previousTimestamp = strtotime($stateCommand->getCollectDate());
		$previousPosition = $positionCommand->execCmd(null, 2);

		$currentState = $whatCommand->execCmd(null, 2);
		$currentTimestamp = strtotime($whatCommand->getCollectDate());
		$currentDuration = $currentTimestamp - $previousTimestamp;

		$deltaPosition = 100 * $currentDuration / $duration;
		if ($previousState == 'UP') {
			$deltaPosition = $deltaPosition;
		} else if ($previousState == 'DOWN') {
			$deltaPosition = -$deltaPosition;
		} else {
			$deltaPosition = 0;
		}
		// 0 -> CLOSED, 100 -> OPEN
		$currentPosition = max(0, min($previousPosition + $deltaPosition, 100));
		$this->updateCommand('position', $currentPosition);

		log::add('mjh', 'debug', 'state : ' . $previousState . ' -> ' . $currentState);
		log::add('mjh', 'debug', ' time : ' . $previousTimestamp . ' -> ' . $currentTimestamp);
		log::add('mjh', 'debug', 'posit : ' . $previousPosition . ' + ' . $deltaPosition . ' -> ' . $currentPosition);

		if ($currentState != 'UP' && $currentPosition == 0) {
			$this->updateCommand('state', 'CLOSED');
		} else if ($currentState != 'DOWN' && $currentPosition == 100) {
			$this->updateCommand('state', 'OPEN');
		} else {
			$this->updateCommand('state', $currentState);
		}
	}

	public function preSave() {
		$who = $this->getConfiguration('who');
		$where = $this->getConfiguration('where');

		$logicalId = $who . ':' . $where;

		$this->setLogicalId($logicalId);
	}

}
