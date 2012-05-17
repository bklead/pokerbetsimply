	try {
		var progressListener = {
			stateIsRequest:false,
			QueryInterface : function(aIID) {
				if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
					aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
					aIID.equals(Components.interfaces.nsISupports))
					return this;
				throw Components.results.NS_NOINTERFACE;
			},
			
			onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
				if (aStatus == 0) {
					setTimeout(function() { 
						window.close();
					}, 1200);
				}
				return 0;
			},
			
			onLocationChange: function(aWebProgress, aRequest, aLocation) {
				return 0;
			},
			
			onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
				
			},
			
			onStatusChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
				
			}
		};
		
		jsPrintSetup.setPrintProgressListener(progressListener);
		
		jsPrintSetup.setOption("marginTop", 0);
		jsPrintSetup.setOption("marginBottom", 0);
		jsPrintSetup.setOption("marginLeft", 0);
		jsPrintSetup.setOption("marginRight", 0);
	
		jsPrintSetup.setOption("headerStrLeft", '');
		jsPrintSetup.setOption("headerStrCenter", '');
		jsPrintSetup.setOption("headerStrRight", '');
	
		jsPrintSetup.setOption("footerStrLeft", '');	
		jsPrintSetup.setOption("footerStrCenter", '');
		jsPrintSetup.setOption("footerStrRight", '');

		jsPrintSetup.setOption("paperHeight", 280);
		jsPrintSetup.setOption("paperWidth", 90);
	
		//jsPrintSetup.clearSilentPrint();
		//jsPrintSetup.setOption('printSilent', 1);
	
		jsPrintSetup.print();
	} catch(e) {
	}
