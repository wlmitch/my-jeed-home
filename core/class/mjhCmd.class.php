<?php

class mjhCmd extends cmd {

	public function execute($_options = array()) {
		log::add('mjh', 'debug', 'Command execute : ' . $this->getId());
		mjh::sendCommand($this->getConfiguration()['value']);
	}

}
