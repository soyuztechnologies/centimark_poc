sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    'use strict';
    return Controller.extend("poc.centi.mark.centimarkui.controller.SafetyScreen",{
        onInit: function() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute('safetyScreen').attachMatched(this.handleRouteMatched , this)
        },
        handleRouteMatched: function(oEvent) {
            var sNotId = oEvent.getParameter("arguments").NtfID;
            // var sBuildID = oEvent.getParameter("arguments").BuildID;
            if(sNotId) {
                this.NotId = sNotId;
                var oModel = this.getView().getModel();
                var sPath = oModel.createKey("/NotificationsSet", {
                    NOT_NO: sNotId
                });
                this.getView().bindElement(sPath, {
                    expand: "NAVBuilding"
                });
            }
        }
    });
});