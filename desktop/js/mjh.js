$("#table_cmd").sortable({
	axis: "y",
	cursor: "move",
	items: ".cmd",
	placeholder: "ui-state-highlight",
	tolerance: "intersect",
	forcePlaceholderSize: true
});

$('body').delegate('.cmdAttr[data-l1key=type]', 'change', function() {
	var tr = $(this).closest('tr');
	var value = $(this).value()
	if (value == 'info') {
		tr.find('.cmdAttr[data-l1key=logicalId]').show();
		tr.find('.cmdAttr[data-l1key=configuration][data-l2key=command]').hide();
	} else if (value == 'action') {
		tr.find('.cmdAttr[data-l1key=logicalId]').hide();
		tr.find('.cmdAttr[data-l1key=configuration][data-l2key=command]').show();
	}
});

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

	/*var tr = $('#table_cmd tbody tr:last');
	jeedom.eqLogic.builSelectCmd({
		id: $(".li_eqLogic.active").attr('data-eqLogic_id'),
		filter: { type: 'info' },
	  error: function (error) {
			$('#div_alert').showAlert({message: error.message, level: 'danger'});
		},
		success: function (result) {
			tr.find('.cmdAttr[data-l1key=value]').append(result);
			tr.find('.cmdAttr[data-l1key=configuration][data-l2key=updateCmdId]').append(result);
			tr.setValues(_cmd, '.cmdAttr');
			jeedom.cmd.changeType(tr, init(_cmd.subType));
		}
	});*/
/*
  if (isset(_cmd.type)) {
		$('#table_cmd tbody tr:last .cmdAttr[data-l1key=type]').value(init(_cmd.type));
	}
	jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
*/
}
