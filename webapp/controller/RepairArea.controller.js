sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    'use strict';
    return Controller.extend("poc.centi.mark.centimarkui.controller.RepairArea",{
        onInit: function() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute('repairScreen').attachMatched(this.handleRouteMatched , this)
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
            this.getView().getModel("local").setProperty("/BuildingName", "Repair Area");

        },
        CreateBuilding: function() {

        },
        SetupPopup: null,
        onPressRepairTile: function(oEvent) {
            // if(!this.SetupPopup) {
            //     this.SetupPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.SetupPopup", this);
            //     this.getView().addDependent(this.SetupPopup);
            // }
            // this.SetupPopup.open();
            this.oRouter.navTo("safetyScreen", {
                NtfID: this.NotId
            });
        },
        onCancelSetup: function() {
            this.SetupPopup.close();
        },
        onConfirmSetup: function() {
            MessageToast.show("Will add the screen soon");
        },
        editBuildingPopup: null,
        onEditBuilding: function() {
            if(!this.editBuildingPopup) {
                this.editBuildingPopup = sap.ui.xmlfragment(this.getView().getId(), "poc.centi.mark.centimarkui.fragments.EditBuildPopup", this);
                this.getView().addDependent(this.editBuildingPopup);
            }
            this.editBuildingPopup.open();
        },
        onCancelBuildPopup: function() {
            this.editBuildingPopup.close();
        },
        onConfirmBuild: function(oEvent) {
            debugger;
            var sAreaName = this.getView().byId("buildingNameField").getValue();
            if(!sAreaName) {
                sAreaName = "Repair Area";
            }
            this.getView().getModel("local").setProperty("/BuildingName", sAreaName);
            this.editBuildingPopup.close();
            MessageToast.show("Building Saved");
            
        },
        convertFileToUrl: function(vContent) {
            var regex = /data:(\w.*);base64,/gm;
            var m = regex.exec(vContent),
            decodedPdfContent = atob(vContent.replace(regex, ""));
            var byteArray = new Uint8Array(decodedPdfContent.length);
            for (var i = 0; i < decodedPdfContent.length; i++) {
            byteArray[i] = decodedPdfContent.charCodeAt(i);
            }
            var blob = new Blob([byteArray.buffer], {
            type: m ? m[1] : 'application/pdf'
            });
            jQuery.sap.addUrlWhitelist("blob");
            return URL.createObjectURL(blob);
        },
        onCaptureBuildImg: function(oEvent) {
            debugger;
            var that = this;
            var files = oEvent.getParameter("files"),
				oBuildImg = this.getView().byId("idBuildingImg");

			if (!files) {
				return;
			}
            if (!files.length) {
                //Blank
            } else {
                var reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        debugger;
                        var vContent = e.currentTarget.result;
                        oBuildImg.setSrc(vContent);
                    } catch (err) {
                        console.log(err);
                    }
                };
                reader.readAsDataURL(files[0]);
            }

			// this.getView().getModel().setProperty("/blocked", true);
			
            // oEvent.getSource().getParent().getItems()[2].upload(true);
        },
        onImgClick: function(oEvent) {
            debugger;
            this.getView().byId("fileUploderField").firePress;
        }
    });
});