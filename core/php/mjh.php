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

require_once __DIR__  . '/../../../../core/php/core.inc.php';
/*
 * Non obligatoire mais peut être utilisé si vous voulez charger en même temps que votre
 * plugin des librairies externes (ne pas oublier d'adapter plugin_info/info.xml).
 *
 *
 */

if (!jeedom::apiAccess(init('apiKey'), 'mjh')) {
  log::add('mjh', 'error', "Unauthorized access");
  header("HTTP/1.1 401 Unauthorized");
  exit;
}

if (!$_POST) {
  log::add('mjh', 'error', "Bad request");
  header("HTTP/1.1 405 Method Not Allowed");
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

echo $data;
