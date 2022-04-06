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
                        that.SetupID = oRes.NAVSetup.results[0].SETUP_ID;
                        that.bindListToSafetySetup();
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
                this.CreateSetupPopup = sap.ui.xmlfragment(this.getView().getId(), "poc.centi.mark.centimarkui.fragments.SetupPopup", this);
                this.getView().addDependent(this.CreateSetupPopup);
            }
            this.CreateSetupPopup.open();
        },
        onConfirmSetup: function(oEvent) {
            debugger;
            var that = this;
            var setupName = this.getView().byId("idSetupName").getValue();
            this.CreateSetupPopup.close();
            var oPayload = {
                "NOT_NO": this.NotId,
                "BUID_ID": this.BuildID,
                "NAME": setupName
            }
            var oModel = this.getView().getModel();
            oModel.create("/SetupSet", oPayload, {
                success: function(oRes) {
                    debugger;
                    that.SetupID = oRes.SETUP_ID;
                    that.CreateSafetyFromTemplate(oRes);
                },
                error: function(oErr) {
                    debugger;
                }
            })
            // that.NotId, that.BuildID
        },
        CreateSafetyFromTemplate: function(objRes) {
            var that = this;
            var oModel = this.getView().getModel();
            oModel.read("/TemplateSet", {
                success: function(oRes) {
                    debugger;
                    var arrTemplates = oRes.results;
                    that.CreateSafetyForSetup(objRes, arrTemplates);
                },
                error: function(oErr) {
                    debugger;
                }
            });
        },
        CreateSafetyForSetup: function(objRes, arrTemp) {
            var oModel = this.getView().getModel();
            var that = this;
            for(var i = 0; i < arrTemp.length; i++) {
                var oPayload = {
                    NOT_NO: objRes.NOT_NO,
                    BUID_ID: objRes.BUID_ID,
                    SETUP_ID: objRes.SETUP_ID,
                    STEMP: arrTemp[i].STEMP,
                    NAME: arrTemp[i].NAME,
                    TYPE: arrTemp[i].TYPE,
                    IS_REQ: arrTemp[i].IS_REQ
                };
                oModel.create("/SafetySet", oPayload, {
                    success: function(oRes) {
                        that.bindListToSafetySetup();
                    }, 
                    error: function(oErr) {
                        debugger;
                    }
                });
            }
        },
        bindListToSafetySetup: function() {
            var oModel = this.getView().getModel();
            var sPath = oModel.createKey("/SetupSet", {
                NOT_NO: this.NotId,
                BUID_ID: this.BuildID,
                SETUP_ID: this.SetupID
            });
            var oList = this.getView().byId("idSafetyList");
            oList.bindElement(sPath, {
                expand: "NAV2Safety"
            });
            oList.s
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
                        var oModel = that.getView().getModel();
                        var sPath = oModel.createKey("/SafetySet", {
                            NOT_NO: tempData.NOT_NO,
                            BUID_ID: tempData.BUID_ID,
                            SETUP_ID: tempData.SETUP_ID,
                            SAFETY_ID: tempData.SAFETY_ID
                        });
                        var that2 = that;
                        var oPayload = {
                            "PHOTO": vContent,
                            "STATUS": "Complete"
                        }
                        oModel.update(sPath, oPayload, {
                            success: function(oRes) {
                                debugger;
                                that2.getView().getModel().refresh();
                            },
                            error: function(oErr) {
                                debugger;
                            }
                        });

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