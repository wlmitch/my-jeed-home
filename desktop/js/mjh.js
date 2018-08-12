$("#table_cmd").sortable({
	axis: "y",
	cursor: "move",
	items: ".cmd",
	placeholder: "ui-state-highlight",
	tolerance: "intersect",
	forcePlaceholderSize: true
});

$('#bt_addAction').on('click', function() {
	addCmdToTable({
		type: 'action'
	});
});
$('#bt_addInfo').on('click', function() {
	addCmdToTable({
		type: 'info'
	});
});

function findTemplate(_cmd) {
	if (init(_cmd.type) == 'info') {
		return $("#command-info-template").html();
	} else if (init(_cmd.type) == 'action')  {
		return $("#command-action-template").html();
	}
}

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
		subtype: init(_cmd.subType)
	};

	var template = findTemplate(_cmd);
	var tr = Mustache.render(template, data);

	$('#table_cmd tbody').append(tr);
	$('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');

	var tr = $('#table_cmd tbody tr:last');
	jeedom.eqLogic.builSelectCmd({
		id: $(".li_eqLogic.active").attr('data-eqLogic_id'),
		filter: { type: 'info' },
	  error: function (error) {
			$('#div_alert').showAlert({message: error.message, level: 'danger'});
		},
		success: function (result) {
			tr.find('.cmdAttr[data-l1key=value]').append(result);
			tr.setValues(_cmd, '.cmdAttr');
			jeedom.cmd.changeType(tr, init(_cmd.subType));
		}
	});

}
