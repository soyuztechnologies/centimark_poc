sap.ui.define([ 
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "poc/centi/mark/centimarkui/utils/formatter"
], function(Controller, MessageToast, formatter) {
    'use strict';
    return Controller.extend("poc.centi.mark.centimarkui.controller.SafetyScreen",{
        formatter: formatter,
        onInit: function() {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute('safetyScreen').attachMatched(this.handleRouteMatched , this)
           
        },
        handleRouteMatched: function(oEvent) {
            var sNotId = oEvent.getParameter("arguments").NtfID;
            var sBuildID = oEvent.getParameter("arguments").BuildID;
            if(sNotId && sBuildID) {
                this.NotId = sNotId;
                this.BuildID = sBuildID;
                var oModel = this.getView().getModel();
                var sPath = oModel.createKey("/NotificationsSet", {
                    NOT_NO: sNotId
                });
                this.getView().bindElement(sPath);
                var sBuildPath = oModel.createKey("/BuildingSet", {
                    NOT_NO: sNotId,
                    BUID_ID: sBuildID
                });
            }
            this.checkForSetup(sBuildPath);
        },
        checkForSetup :function(sPath) {
            var that = this;
            var oModel = this.getView().getModel();
            oModel.read(sPath, {
                urlParameters: {
                    "$expand": "NAVSetup"
                },
                success: function(oRes) {
                    debugger;
                    var arrSetup = oRes.NAVSetup.results;
                    if(arrSetup.length) {
                        that.LoadSaftyForSetup(arrSetup[0]);
                    }else {
                        that.createSetupForBuild();
                    }
                },
                error: function(oErr) {
                    debugger;
                }
            });
        },
        CreateSetupPopup: null,
        createSetupForBuild: function() {
            if(!this.CreateSetupPopup) {
                this.CreateSetupPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.SetupPopup", this);
                this.getView().addDependent(this.CreateSetupPopup);
            }
            this.CreateSetupPopup.open();
            // var oPayload = {
            //     "NOT_NO": sNotId,
            //     "BUID_ID": sBuildId,
            //     "NAME": 
            // }
        },
        onConfirmSetup: function(oEvent) {
            var oEvent = 
            this.CreateSetupPopup.close();
            var oPayload = {
                "NOT_NO": this.NotId,
                "BUID_ID": this.BuildID,
                "NAME": ''
            }
            // that.NotId, that.BuildID
        },
        getSetupForBinding: function(sBuildPath) {
            if(sBuildPath) {
                this.checkBuildingSetup();
                var objSafetyList = this.getView().byId("idSafetyList");
                objSafetyList.bindElement(sBuildPath, {
                    expand: "NAVSetup"
                });
            }
        },
        onBack: function(){
            this.oRouter.navTo('repairScreen',{
                NtfID : this.NotId
            });  
        },
        onPhotoCapture : function (oEvent){
            debugger;
            var tempData = oEvent.getSource().getBindingContext().getObject();
            // var oItemsObject=oEvent.getSource().getParent().getItems()[0].getItems()[2].getItems();
            // oEvent.getSource().getParent().getItems()[0].getItems()[2].getItems()[3].setVisible(true);
            var that = this;
            var files = oEvent.getParameter("files");
            if (!files.length) {
                //Blank
            } else {
                var reader = new FileReader();
                reader.onload = async function(e) {
                    try {
                        debugger;
                        var vContent = e.currentTarget.result;
                        tempData.PHOTO = vContent;
                        // oItemsObject[3].setSrc(vContent);
                        // oItemsObject[3].setVisible(true);
                        // oItemsObject[0].setVisible(false);
                        // oItemsObject[1].setVisible(false);
                        // oItemsObject[2].setVisible(false);
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
        // onConfirmSetup : function(oEvent) {
        //     debugger;
        //     var oSetupName = oEvent.getSource().getParent().getContent()[0]._aElements[1].getProperty('value');
        //     if(!oSetupName) {
        //         oSetupName = "Setup";
        //     }
        //     this.getView().getModel("local").setProperty("/SetUpName", oSetupName);
        //     this.SetupPopup.close();
        //     MessageToast.show("Setup Saved");
        //     this.SetupPopup.close();
        // }
    });
});