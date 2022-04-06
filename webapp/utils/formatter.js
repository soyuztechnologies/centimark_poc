sap.ui.define([
], function () {
    'use strict';
    return {
        getButtonStatus: function (statusStr) {
            //     if(statusStr) {
            //         if (S)
            //     }
            // }
        },
        getImage: function(photoStr) {
            if(!photoStr) {
                return './images/camera_icon.png';
            }else {
                retur
            }
        },
        getIconVisibility: function(photoStr) {
            if(photoStr) {
                return false;
            }else {
                return true;
            }
        },
        getPhotoVisibility: function(photoStr) {
            if(photoStr) {
                return true;
            }else {
                return false;
            }
        },
        getSaftyListBtnText: function(photoStr) {
            if(photoStr) {
                return 'RECAPTURE PHOTO';
            }else {
                return 'CAPTURE PHOTO';
            }
        },
        getSaftyListImgVisibility: function(photoStr) {
            if(photoStr) {
                return true;
            }else {
                return false;
            }
        },
        getSaftyListImgBoxVisibility: function(photoStr) {
            if(photoStr) {
                return false;
            }else {
                return true;
            }
        },
        getIconStatusColor: function(sStatus) {
            if(sStatus === 'Complete') {
                return "#4caf50";
            }else {
                return "#f9a429";
            }
        },
        getStatusIcon: function(sStatus) {
            if(sStatus === 'Complete') {
                return "sap-icon://accept";
            }else {
                return "sap-icon://status-positive";
            }
        }
    }
});