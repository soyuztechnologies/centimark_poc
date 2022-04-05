sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("poc.centi.mark.centimarkui.controller.Notifications", {
            onInit: function () {
                this.oRouter =  this.oRouter = this.getOwnerComponent().getRouter();
            },
            AddressPopup: null,
            onListButtonPress: function(oEvent) {
                debugger;
                this.NotificationData = oEvent.getSource().getParent().getBindingContext().getObject();
                var sNotNum = oEvent.getSource().getParent().getBindingContext().getObject().NOT_NUM;
                this.getView().getModel("local").setProperty("/NotificationNum", sNotNum);
                if(!this.AddressPopup) {
                    this.AddressPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.details", this);
                    this.getView().addDependent(this.AddressPopup);
                }
                this.AddressPopup.open();
            },
            onCloseDetail: function() {
                this.AddressPopup.close();
            },
            onMapIconPress: function() {
                MessageToast.show("Maps not Available rigth now");
            },
            SignaturePopup: null,
            onContinueWork: function() {
                if(this.AddressPopup) {
                    this.onCloseDetail();
                }
                if(!this.SignaturePopup) {
                    this.SignaturePopup = sap.ui.xmlfragment(this.getView().getId(), "poc.centi.mark.centimarkui.fragments.SignaturePopup", this)
                    this.getView().addDependent(this.SignaturePopup);
                }
                this.SignaturePopup.open();
                debugger;
                // this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
                this.onSign();
            },
            onCloseSignature: function() {
                this.SignaturePopup.close();
            },
            onSign : function(dialogWidth, dialogHeigth){
                var canvas = document.getElementById("signature-pad");
                var context = canvas.getContext("2d");
                canvas.width = 750;
                canvas.height = 400;
                context.fillStyle = "#d9d9d9";
                context.lineWidth = 1.5;
                context.lineCap = "round";
                context.fillRect(0, 0, canvas.width, canvas.height);
                var disableSave = true;
                var empty;
                var pixels = [];
                var cpixels = [];
                var xyLast = {};
                var xyAddLast = {};
                var calculate = false;
                	//functions
                    function remove_event_listeners() {
                        canvas.removeEventListener('mousemove', on_mousemove, false);
                        canvas.removeEventListener('mouseup', on_mouseup, false);
                        canvas.removeEventListener('touchmove', on_mousemove, false);
                        canvas.removeEventListener('touchend', on_mouseup, false);
        
                        document.body.removeEventListener('mouseup', on_mouseup, false);
                        document.body.removeEventListener('touchend', on_mouseup, false);
                    }
        
                    function get_coords(e) {
                        var x, y;
        
                        if (e.changedTouches && e.changedTouches[0]) {
                            var offsety = canvas.offsetTop || 0;
                            var offsetx = canvas.offsetLeft || 0;
        
                            x = e.changedTouches[0].pageX - offsetx;
                            y = e.changedTouches[0].pageY - offsety;
                        } else if (e.layerX || 0 == e.layerX) {
                            x = e.layerX;
                            y = e.layerY;
                        } else if (e.offsetX || 0 == e.offsetX) {
                            x = e.offsetX;
                            y = e.offsetY;
                        }
        
                        return {
                            x : x, y : y
                        };
                    };
        
                    function on_mousedown(e) {
                        e.preventDefault();
                        e.stopPropagation();
        
                        canvas.addEventListener('mouseup', on_mouseup, false);
                        canvas.addEventListener('mousemove', on_mousemove, false);
                        canvas.addEventListener('touchend', on_mouseup, false);
                        canvas.addEventListener('touchmove', on_mousemove, false);
                        document.body.addEventListener('mouseup', on_mouseup, false);
                        document.body.addEventListener('touchend', on_mouseup, false);
        
                        empty = false;
                        var xy = get_coords(e);
                        context.beginPath();
                        pixels.push('moveStart');
                        context.moveTo(xy.x, xy.y);
                        pixels.push(xy.x, xy.y);
                        xyLast = xy;
                    };
        
                    function on_mousemove(e, finish) {
                        e.preventDefault();
                        e.stopPropagation();
        
                        var xy = get_coords(e);
                        var xyAdd = {
                            x : (xyLast.x + xy.x) / 2,
                            y : (xyLast.y + xy.y) / 2
                        };
        
                        if (calculate) {
                            var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                            var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                            pixels.push(xLast, yLast);
                        } else {
                            calculate = true;
                        }
        
                        context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                        pixels.push(xyAdd.x, xyAdd.y);
                        context.stroke();
                        context.beginPath();
                        context.moveTo(xyAdd.x, xyAdd.y);
                        xyAddLast = xyAdd;
                        xyLast = xy;
        
                    };
        
                    function on_mouseup(e) {
                        remove_event_listeners();
                        disableSave = false;
                        context.stroke();
                        pixels.push('e');
                        calculate = false;
                    };
                
                canvas.addEventListener('touchstart', on_mousedown, false);
                canvas.addEventListener('mousedown', on_mousedown, false);
        
            },
            /***********Download the Signature Pad********************/
            
            saveButton : function(oEvent){
                var canvas = document.getElementById("signature-pad");
                var link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg'); 
                link.download = 'sign.jpeg';
                link.click(); 
                var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
                    penColor: 'rgb(0, 0, 0)',
                    velocityFilterWeight: .7,
                    minWidth: 0.5,
                    maxWidth: 2.5,
                    throttle: 16, // max x milli seconds on event update, OBS! this introduces lag for event update
                    minPointDistance: 3
                    //   backgroundColor: '#C0C0C0',
                    //   penColor: 'rgb(0, 0, 0)'
                });
            },
            
            /************Clear Signature Pad**************************/
            
            onClearSign : function(oEvent){
                var canvas = document.getElementById("signature-pad");
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "#d9d9d9";
                context.lineWidth = 1.5;
                context.lineCap = "round";
                context.fillRect(0, 0, canvas.width, canvas.height);
                var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
                    penColor: 'rgb(0, 0, 0)',
                    velocityFilterWeight: .7,
                    minWidth: 0.5,
                    maxWidth: 2.5,
                    throttle: 16, // max x milli seconds on event update, OBS! this introduces lag for event update
                    minPointDistance: 3
                    //   backgroundColor: '#ffffff',
                    //   penColor: 'rgb(0, 0, 0)',
                    //   penWidth : '1'
                });
            },
            skipReasonPopup: null,
            onSkipSign: function() {
                if(this.SignaturePopup) {
                    this.onCloseSignature();
                }
                if(!this.skipReasonPopup) {
                    this.skipReasonPopup = sap.ui.xmlfragment(this.getView().getId(), "poc.centi.mark.centimarkui.fragments.SkipReasonPopup", this);
                    this.getView().addDependent(this.skipReasonPopup);
                }
                this.skipReasonPopup.open();
            },
            onCancelReason: function() {
                this.skipReasonPopup.close();
            },
            onProceedSign: function() {
                // MessageToast.show("Wait will implement it soon");
                
                this.oRouter.navTo("repairScreen", {
                    "NtfID": this.NotificationData.NOT_NO
                });
                // if(!this.EditBuildPopup) {
                //     this.EditBuildPopup = sap.ui.xmlfragment("poc.centi.mark.centimarkui.fragments.EditBuildPopup", this);
                //     this.getView().addDependent(this.EditBuildPopup);
                // }
                // this.EditBuildPopup.open();
            }

        });
    });
