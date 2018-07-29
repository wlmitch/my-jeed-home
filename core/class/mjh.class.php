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
    $return['state'] = 'nok';

    return $return;
  }

	public static function dependancy_install() {
		log::add('mjh', 'info', 'Dependency install');
	}

  public static function deamon_info() {
    $return = array();
    $return['log'] = 'mjh';
    $return['launchable'] = 'ok';

    $pid = trim(shell_exec('ps ax | grep "mjh/node/deamon.js" | grep -v "grep" | wc -l'));
    if ($pid != '' && $pid != '0') {
      $return['state'] = 'ok';
    } else {
      $return['state'] = 'nok';
    }

    return $return;
  }

    /*     * *********************Méthodes d'instance************************* */

    public function preInsert() {

    }

    public function postInsert() {

    }

    public function preSave() {

    }

    public function postSave() {

    }

    public function preUpdate() {

    }

    public function postUpdate() {

    }

    public function preRemove() {

    }

    public function postRemove() {

    }

    /*     * **********************Getteur Setteur*************************** */
}

class mjhCmd extends cmd {
    /*     * *************************Attributs****************************** */


    /*     * ***********************Methode static*************************** */


    /*     * *********************Methode d'instance************************* */

    /*
     * Non obligatoire permet de demander de ne pas supprimer les commandes même si elles ne sont pas dans la nouvelle configuration de l'équipement envoyé en JS
      public function dontRemoveCmd() {
      return true;
      }
     */

    public function execute($_options = array()) {

    }

    /*     * **********************Getteur Setteur*************************** */
}
