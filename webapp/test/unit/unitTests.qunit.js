/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"poccentimark/centimark_ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
