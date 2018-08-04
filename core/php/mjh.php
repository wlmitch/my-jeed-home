<?php

require_once __DIR__  . '/../../../../core/php/core.inc.php';

if (!jeedom::apiAccess(init('apiKey'), 'mjh')) {
   log::add('mjh', 'error', "Unauthorized access");
   header("HTTP/1.1 401 Unauthorized");
   exit;
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
   log::add('mjh', 'error', "Bad request");
   header("HTTP/1.1 405 Method Not Allowed");
   exit;
}

mjh::processEvent(json_decode(file_get_contents('php://input'), true));
