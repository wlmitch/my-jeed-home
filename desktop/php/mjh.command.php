<div role="tabpanel" class="tab-pane" id="commandtab">
	<a class="btn btn-success btn-sm cmdAction pull-right" data-action="add" style="margin-top:5px;"><i class="fa fa-plus-circle"></i> {{Commandes}}</a><br/><br/>
	<table id="table_cmd" class="table table-bordered table-condensed">
		<thead>
			<tr>
				<th style="width: 50px;">#</th>
				<th style="width: 230px;">{{Nom}}</th>
				<th style="width: 100px;">{{Type}}</th>
				<th>{{Commande}}</th>
				<th style="width: 200px;">{{Paramètres}}</th>
				<th style="width: 80px;"></th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>

<script id="command-template" type="text/template">
  <tr class="cmd" data-cmd_id="[[id]]">
    <td>
      <span class="cmdAttr" data-l1key="id"></span>
    </td>
    <td>
      <div class="form-group">
        <div>
          <input class="cmdAttr form-control input-sm" data-l1key="name" placeholder="{{Nom}}">
        </div>
				<div>
					<label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isVisible" checked="">{{Afficher}}</label>
					<label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isHistorized" checked/>{{Historiser}}</label>
				</div>
      </div>
    </td>
    <td>
      <div class="type" type="[[type]]">[[&types]]</div>
      <div class="subType" subType="[[subType]]"></div>
    </td>
    <td>
      <div>
        <input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="command" placeholder="{{Commande}}"/>
      </div>
			<div>
				<input class="cmdAttr form-control input-sm" data-l1key="logicalId" placeholder="{{Identifiant logique}}"/>
			</div>
			<div>
				<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="duration" placeholder="{{Durée minimum (ms)}}"/>
			</div>
    </td>
    <td>
      <div>
          <input class="cmdAttr form-control input-sm" data-l1key="unite" placeholder="{{Unité}}">
      </div>
      <div class="input-group">
        <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="width : 50%;" />
        <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="width : 50%;" />
      </div>
    </td>
    <td>
      <div class="btn-group">
        [[#id]]
        <a class="btn btn-default btn-xs cmdAction" data-action="configure" data-toggle="tooltip" title="Configure"><i class="fa fa-cogs"></i></a>
        <a class="btn btn-default btn-xs cmdAction" data-action="test" data-toggle="tooltip" title="Test"><i class="fa fa-rss"></i></a>
        [[/id]]
        <a class="btn btn-default btn-xs cmdAction" data-action="remove" data-toggle="tooltip" title="Remove"><i class="fa fa-minus-circle"></i></a>
      </div>
    </td>
  </tr>
</script>
