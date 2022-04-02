sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    'use strict';
    return Controller.extend("poc.centi.mark.centimarkui.controller.RepairArea",{
        onInit: function() {
            debugger;
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute('repairScreen').attachMatched(this.handleRouteMatched , this)
        },
        handleRouteMatched: function(oEvent) {
            var sNotId = oEvent.getParameter("arguments").NtfID;
            if(sNotId) {
                var oModel = this.getView().getModel();
                var sPath = oModel.createKey("/NotificationsSet", {
                    NOT_NO: sNotId
                });
                this.getView().bindElement(sPath);
            }
        },
        SetupPopup: null,
        onPressRepairTile: function(oEvent) {
            // MessageToast.show("Tile Pressed");
            if(!this.SetupPopup) {
                this.SetupPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.SetupPopup", this);
                this.getView().addDependent(this.SetupPopup);
            }
            this.SetupPopup.open();
        },
        onCancelSetup: function() {
            this.SetupPopup.close();
        },
        onConfirmSetup: function() {
            MessageToast.show("Will add the screen soon");
        }
    });
});