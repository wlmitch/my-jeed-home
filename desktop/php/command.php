
<script id="command-template" type="text/template">
  <tr class="cmd" data-cmd_id="[[id]]">
    <td>
      <span class="cmdAttr" data-l1key="id"></span>
    </td>
    <td>
      <span class="cmdAttr" data-l1key="id" style="display:none;"></span>
      <input class="cmdAttr form-control input-sm" data-l1key="name" style="width : 140px;" placeholder="{{Nom}}">
    </td>
    <td>
      <span class="type" type="[[type]]">[[$types]]</span>
      <span class="subType" subType="[[subType]]"></span>
    </td>
    <td>
      Valeur
    </td>
    <td>
      <span><label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isVisible" checked/>{{Afficher}}</label></span>
      <input class="tooltips cmdAttr form-control input-sm expertModeVisible" data-l1key="configuration" data-l2key="listValue" placeholder="{{Liste de valeur|texte séparé par ;}}" title="{{Liste}}" style="margin-top : 5px;">
      <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="width : 40%;display : inline-block;" />
      <input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="width : 40%;display : inline-block;" />
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
