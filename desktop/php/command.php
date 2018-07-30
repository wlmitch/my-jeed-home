
<script id="command-template" type="text/template">
  <tr class="cmd" data-cmd_id="[[id]]">
    <td>
      <span class="cmdAttr" data-l1key="id"></span>
    </td>
    <td>
      <div class="form-group">
        <input class="cmdAttr form-control input-sm" data-l1key="name" placeholder="{{Nom}}">
      </div>
    </td>
    <td>
      <div class="form-group type" type="[[type]]">[[&types]]</div>
      <div class="form-group subType" subType="[[subType]]"></div>
    </td>
    <td>
      Valeur
    </td>
    <td>
      <div class="form-group">
          <label class="checkbox"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isVisible" checked=""> {{Afficher}}</label>
      </div>
      <div class="form-group">
          <input class="cmdAttr form-control input-sm" data-l1key="unite" placeholder="{{Unité}}">
      </div>
      <div class="form-group input-group">
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
