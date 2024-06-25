define([
    "dojo/_base/declare", "dojox/widget/Toaster"
], 
function(declare, Toaster) {
	
	return declare("scanPluginDojo.scan.Toaster", [], {
		
		toaster: new Toaster(),
		
		greenToaster: function(msg){
            this.toaster.positionDirection = "tl-down";
            this.toaster.setContent(msg, "message", 3000);
            this.toaster.show();
        },
	
        redToaster: function(msg){
        	this.toaster.positionDirection = "tl-down";
        	this.toaster.setContent(msg, "error", 3000);
        	this.toaster.show();
        },
	
	});
   
});