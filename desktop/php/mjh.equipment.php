
<!-- Equipement -->
<div class="col-lg-10 col-md-9 col-sm-8 eqLogic" style="display: none">
	<div class="btn-group pull-right">
		<button type="button" class="btn btn-default eqLogicAction" data-action="copy"><i class="fa fa-files-o"></i> {{Dupliquer}}</button>
		<button type="button" class="btn btn-default eqLogicAction" data-action="configure"><i class="fa fa-cogs"></i> {{Avancé}}</button>
  	<button type="button" class="btn btn-danger eqLogicAction" data-action="remove"><i class="fa fa-minus-circle"></i> {{Supprimer}}</button>
		<button type="button" class="btn btn-success eqLogicAction" data-action="save"><i class="fa fa-check-circle"></i> {{Sauvegarder}}</button>
	</div>

	<!-- Tabs -->
	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation"><a href="#" class="eqLogicAction" aria-controls="home" role="tab" data-toggle="tab" data-action="returnToThumbnailDisplay"><i class="fa fa-arrow-circle-left"></i></a></li>
		<li role="presentation" class="active"><a href="#eqlogictab" aria-controls="home" role="tab" data-toggle="tab"><i class="fa fa-tachometer"></i> {{Equipement}}</a></li>
		<li role="presentation"><a href="#commandtab" aria-controls="profile" role="tab" data-toggle="tab"><i class="fa fa-list-alt"></i> {{Commandes}}</a></li>
	</ul>

	<div class="tab-content" style="height:calc(100% - 50px);overflow:auto;overflow-x: hidden;">

		<!-- Equipment configuration -->
		<div role="tabpanel" class="tab-pane active" id="eqlogictab">
			<br/>
			<form class="form-horizontal">
				<fieldset>
					<div class="form-group">
						<label class="col-sm-3 control-label">{{Nom de l'équipement}}</label>
						<div class="col-sm-3">
							<input type="text" class="eqLogicAttr form-control" data-l1key="id" style="display : none;" />
							<input type="text" class="eqLogicAttr form-control" data-l1key="name" placeholder="{{Nom de l'équipement}}"/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label">{{Identifiant}}</label>
						<div class="col-sm-3">
							<input type="text" class="eqLogicAttr form-control" data-l1key="logicalId" disabled/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label" >{{Objet parent}}</label>
						<div class="col-sm-3">
							<select id="sel_object" class="eqLogicAttr form-control" data-l1key="object_id">
								<option value="">{{Aucun}}</option>
								<?php
foreach (jeeObject::all() as $object) {
	echo '<option value="' . $object->getId() . '">' . $object->getName() . '</option>';
}
								?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label">{{Catégorie}}</label>
						<div class="col-sm-3">
							<?php
foreach (jeedom::getConfiguration('eqLogic:category') as $key => $value) {
	echo '<label class="checkbox-inline">';
	echo '<input type="checkbox" class="eqLogicAttr" data-l1key="category" data-l2key="' . $key . '" />' . $value['name'];
	echo '</label>';
}
							?>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label"></label>
						<div class="col-sm-9">
							<label class="checkbox-inline"><input type="checkbox" class="eqLogicAttr" data-l1key="isEnable" checked/>{{Activer}}</label>
							<label class="checkbox-inline"><input type="checkbox" class="eqLogicAttr" data-l1key="isVisible" checked/>{{Visible}}</label>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label">{{WHO}}</label>
						<div class="col-sm-3">
							<select class="eqLogicAttr form-control" data-l1key="configuration" data-l2key="who">
								<?php
foreach (mjh::findWhos() as $key => $value) {
	echo '<option value="'. $value['who'] . '">'. $value['who'] . ' - ' . $value['name'] . '</option>';
}
								?>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label">{{WHERE}}</label>
						<div class="col-sm-3">
							<input type="text" class="eqLogicAttr form-control" data-l1key="configuration" data-l2key="where" />
						</div>
					</div>
				</fieldset>
			</form>
		</div>

		<!-- Equipement commands -->
		<?php include __DIR__ . '/mjh.command.php' ?>

	</div>

</div>
