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


$("#table_cmd").sortable({
	axis: "y",
	cursor: "move",
	items: ".cmd",
	placeholder: "ui-state-highlight",
	tolerance: "intersect",
	forcePlaceholderSize: true
});
/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */
function addCmdToTable(_cmd) {
	if (!isset(_cmd)) {
		var _cmd = {
			configuration: {}
		};
	}
	if (!isset(_cmd.configuration)) {
		_cmd.configuration = {};
	}

	var data = {
		id: init(_cmd.id),
		type: init(_cmd.type),
		types: jeedom.cmd.availableType(),
		subtype: init(_cmd.subType)
	};
	var template = $("#command-template").html();
	var tr = Mustache.render(template, data);

	$('#table_cmd tbody').append(tr);
	$('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');

	var tr = $('#table_cmd tbody tr:last');
	jeedom.eqLogic.builSelectCmd({
		id: $(".li_eqLogic.active").attr('data-eqLogic_id'),
		filter: {type: 'info'},
	  error: function (error) {
			$('#div_alert').showAlert({message: error.message, level: 'danger'});
		},
		success: function (result) {
			tr.find('.cmdAttr[data-l1key=value]').append(result);
			tr.find('.cmdAttr[data-l1key=configuration][data-l2key=updateCmdId]').append(result);
			tr.setValues(_cmd, '.cmdAttr');
			jeedom.cmd.changeType(tr, init(_cmd.subType));
		}
	});
/*
  if (isset(_cmd.type)) {
		$('#table_cmd tbody tr:last .cmdAttr[data-l1key=type]').value(init(_cmd.type));
	}
	jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
*/
}
