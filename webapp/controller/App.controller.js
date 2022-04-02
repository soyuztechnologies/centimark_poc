sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("poc.centi.mark.centimarkui.controller.App", {
            onInit: function () {
                this.oRouter =  this.oRouter = this.getOwnerComponent().getRouter();
                // this.oRouter.getRoute('RouteApp').attachPatternMatched(this.oRouteMatched , this)
            },
            onLogin: function() {
                this.oRouter.navTo("NoticeView");
            }
        });
    });
