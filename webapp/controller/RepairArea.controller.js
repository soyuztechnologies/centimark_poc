sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "poc/centi/mark/centimarkui/utils/formatter"
], function(Controller, MessageToast, formatter) {
    'use strict';
    return Controller.extend("poc.centi.mark.centimarkui.controller.RepairArea",{
        formatter: formatter,
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
            this.LoadFirstBuilding(sNotId, sPath);
            var oModel = this.getView().getModel();
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            // this.getView().getModel("local").setProperty("/BuildingName", "Repair Area");

        },
        LoadFirstBuilding: function(sNotId, sPath) {
            if (sNotId) {
                var that = this;
                var oModel = this.getView().getModel();
                oModel.read(sPath, {
                    urlParameters: {
                        "$expand": "NAVBuilding"
                    },
                    success: function(oRes) {
                        debugger;
                        var oBuildingData = oRes.NAVBuilding.results[0];
                        var sNotId = oBuildingData.NOT_NO;
                        var sBuildID = oBuildingData.BUID_ID;
                        that.BindDashbordToBuilding(sNotId, sBuildID);
                    },
                    error: function(oErr) {
                        debugger;
                    }
                });
            }
        },
        BindDashbordToBuilding: function(sNotifID, sBuildID) {
            if(sNotifID && sBuildID) {
                var oModel = this.getView().getModel();
                var sBuildPath = oModel.createKey("/BuildingSet", {
                    "NOT_NO": sNotifID,
                    "BUID_ID": sBuildID
                });
                var oGridList = this.getView().byId("repairAreaList");
                oGridList.bindElement(sBuildPath);
            }
        },
        onBack: function(){
            this.oRouter.navTo('NoticeView');  
        },
        CreateBuilding: function() {

        },
        SetupPopup: null,
        onPressRepairTile: function(oEvent) {
            var BuildingData = oEvent.getSource().getBindingContext().getObject();
            // if(!this.SetupPopup) {
            //     this.SetupPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.SetupPopup", this);
            //     this.getView().addDependent(this.SetupPopup);
            // }
            // this.SetupPopup.open();
            this.oRouter.navTo("safetyScreen", {
                NtfID: this.NotId,
                BuildID: BuildingData.BUID_ID
            });
        },
        onCancelSetup: function() {
            this.SetupPopup.close();
        },
        onConfirmSetup: function() {
            debugger;
            MessageToast.show("Will add the screen soon");
            this.SetupPopup.close();
        },
        editBuildingPopup: null,
        onEditBuilding: function(oEvent) {
            debugger;
            var sPath = oEvent.getSource().getBindingContext().getPath();
            if(!this.editBuildingPopup) {
                this.editBuildingPopup = sap.ui.xmlfragment(this.getView().getId(), "poc.centi.mark.centimarkui.fragments.EditBuildPopup", this);
                this.getView().addDependent(this.editBuildingPopup);
            }
            this.editBuildingPopup.open();
            this.editBuildingPopup.bindElement(sPath);
        },
        onCancelBuildPopup: function() {
            this.editBuildingPopup.close();
        },
        onConfirmBuild: function(oEvent) {
            debugger;
            var oBuildObject = oEvent.getSource().getBindingContext().getObject();
            var sPath = oEvent.getSource().getBindingContext().getPath();
            var that = this;
            var oPayload = {
                "NAME": oBuildObject.NAME,
                "COMMENTS": oBuildObject.COMMENTS,
                "PHOTO": oBuildObject.PHOTO
            }
            var oModel = this.getView().getModel();
            oModel.update(sPath, oPayload, {
                success: function(oRes) {
                    debugger;
                    that.editBuildingPopup.close();
                    MessageToast.show("Building Saved");
                },
                error: function(oErr) {
                    debugger;
                }
            })
            // var sAreaName = this.getView().byId("buildingNameField").getValue();
            // if(!sAreaName) {
            //     sAreaName = "Repair Area";
            // }
            // this.getView().getModel("local").setProperty("/BuildingName", sAreaName);
            
            
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
				oBuildImg = this.getView().byId("idBuildingImg"),
                oCameraIcon = this.getView().byId("idCameraIcon");

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
                        oBuildImg.setVisible(true);
                        oCameraIcon.setVisible(false);
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