<div role="tabpanel" class="tab-pane" id="commandtab">
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
	<div>
		<div class="btn-group pull-right">
  		<button id="bt_addAction" type="button" class="btn btn-sm btn-success"><i class="fa fa-plus-circle"></i> {{Action}}</button>
  		<button id="bt_addInfo" type="button" class="btn btn-sm btn-primary"><i class="fa fa-plus-circle"></i> {{Info}}</button>
		</div>
	</div>
</div>

<script id="command-info-template" type="text/template">
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
      <div><input class="cmdAttr form-control type input-sm" data-l1key="type" value="info" disabled></div>
      <div class="subType" subType="[[subType]]"></div>
    </td>
    <td>
			<div>
				<input class="cmdAttr form-control input-sm" data-l1key="logicalId" placeholder="{{Identifiant logique}}"/>
			</div>
			<div>
				<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="duration" placeholder="{{Durée en secondes}}"/>
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

<script id="command-action-template" type="text/template">
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
				</div>
      </div>
    </td>
    <td>
      <div><input class="cmdAttr form-control type input-sm" data-l1key="type" value="action" disabled></div>
      <div class="subType" subType="[[subType]]"></div>
    </td>
    <td>
      <div>
        <input class="cmdAttr form-control input-sm" data-l1key="logicalId" placeholder="{{Commande}}"/>
      </div>
			<div>
				<select class="cmdAttr form-control input-sm" data-l1key="value" title="Information de la valeur">
					<option value="">Aucune</option>
				</select>
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
