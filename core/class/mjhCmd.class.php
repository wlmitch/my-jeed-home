<?php

class mjhCmd extends cmd {

		public function execute($_options = array()) {
				log::add('mjh', 'info', 'Command execute');
				log::add('mjh', 'info', $_options);
		}

}
