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
            this.getView().getModel('local').setProperty('/SetUpName', 'Setup');
            this.getView().getModel('local').setProperty('/buttonTxt', 'Capture Photo');
        },
        onBack: function(){
            this.oRouter.navTo('repairScreen',{
                NtfID : this.NotId
            });  
        },
        onPhotoCapture : function (oEvent){
            debugger;
            var oItemsObject=oEvent.getSource().getParent().getItems()[0].getItems()[2].getItems();
            // oEvent.getSource().getParent().getItems()[0].getItems()[2].getItems()[3].setVisible(true);
            var that = this;
            var files = oEvent.getParameter("files")
				// oBuildImg = this.getView().byId("idBuildingImg");

			if (!files) {
				return;
                    //    MessageToast.show('Please select a image first');
			}
            if (!files.length) {
                //Blank
            } else {
                var reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        debugger;
                        var vContent = e.currentTarget.result;
                        oItemsObject[3].setSrc(vContent);
                        oItemsObject[3].setVisible(true);
                        oItemsObject[0].setVisible(false);
                        oItemsObject[1].setVisible(false);
                        oItemsObject[2].setVisible(false);
                        // this.getView().getModel('local').setProperty('/buttonTxt', 'Recapture');
                    } catch (err) {
                        console.log(err);
                    }
                };
                this.getView().getModel('local').setProperty('/buttonTxt', 'Recapture');
                reader.readAsDataURL(files[0]);
            }
        },
        onEditSetup: function (oEvent) {
            if(!this.SetupPopup) {
                this.SetupPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.SetupPopup", this);
                this.getView().addDependent(this.SetupPopup);
            }
            this.SetupPopup.open();
        },
        onCancelSetup: function() {
            this.SetupPopup.close();
        },
        onConfirmSetup : function(oEvent) {
            debugger;
            var oSetupName = oEvent.getSource().getParent().getContent()[0]._aElements[1].getProperty('value');
            if(!oSetupName) {
                oSetupName = "Setup";
            }
            this.getView().getModel("local").setProperty("/SetUpName", oSetupName);
            this.SetupPopup.close();
            MessageToast.show("Setup Saved");
            this.SetupPopup.close();
        }
    });
});