<?php

/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

/* * ***************************Includes********************************* */
require_once __DIR__  . '/../../../../core/php/core.inc.php';

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
    $gatewayAddress = config::byKey('serverPort', 'mjh', '12345');
    $gatewayPort = config::byKey('serverPort', 'mjh', '12345');
    $gatewayPassword = config::byKey('serverPort', 'mjh', '12345');
    $cmd = 'nice -n 19 nodejs ' . $path .
        ' --serverPort=' . $serverPort .
        ' --gatewayAddress=' . $gatewayAddress .
        ' --gatewayPort=' . $gatewayPort .
        ' --gatewayPassword=' . $gatewayPassword;

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

    $socket = socket_create(AF_INET, SOCK_STREAM, 0);
    socket_connect($socket, '127.0.0.1', config::byKey('serverPort', 'mjh', 55006));
    socket_write($socket, 'shutdown', strlen('shutdown'));
    socket_close($socket);
  }

}

class mjhCmd extends cmd {

    public function execute($_options = array()) {

    }

}
