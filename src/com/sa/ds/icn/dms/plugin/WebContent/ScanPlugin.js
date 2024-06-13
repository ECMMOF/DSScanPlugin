require(
		[
				"dojo/_base/declare",
				"dojo/_base/lang",
				"scanPluginDojo/scan/AddContentItemWithScanDialog",
				"scanPluginDojo/scan/AddContentItemCustomDialog",
				"scanPluginDojo/scan/AddDMSContentItemWithScanDialog",
				"dojo/i18n!scanPluginDojo/scan/scanResources/nls/Messages",
				"scanPluginDojo/scan/CheckInWithScanDialog",
				"scanPluginDojo/scan/CommonScan", "dojo/aspect", "dojo/ready","dojo/request/script"

		],
		function(declare, lang, AddContentItemDialog,
				AddContentItemCustomDialog, AddDMSContentItemWithScanDialog,
				Messages, CheckInDialog, CommonScan, aspect, ready,script) {
			
			
		     aspect.after(ecm.model.desktop,"onLogin", lang.hitch( this, function() {
	    			script.get("Resources/DWTSample_AdvancedScan_operation.js");
	    			script.get("Resources/DWTSample_AdvancedScan_initpage.js");
	    			
	    			script.get("Resources/dynamsoft.webtwain.initiate.js");
	    			script.get("Resources/dynamsoft.webtwain.install.js");
	    			script.get("Resources/dynamsoft.webtwain.config.js");
//	    			script.get("plugin/DMSScanPlugin/getResource/scanPluginDojo/scan/scanResources/Scripts/dynamsoft.webtwain.viewer.js");
					
			  
				}));

			self: null,
			/**
			 * Use this function to add any global JavaScript methods your
			 * plug-in requires.
			 */

			lang.setObject("scanDocument", function(repository, items,
					callback, teamspace, resultSet, parameterMap) {

				var addContentItemDialog = new AddContentItemDialog();
				addContentItemDialog.initScanActions(repository, items,
						callback, teamspace, resultSet, parameterMap);
				Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady',
						function() {
							// OnWebTwainReady();
							DWTonReady();
						});
				Dynamsoft.WebTwainEnv.Load();
			});

			lang.setObject("scanCheckin", function(repository, items, callback,
					teamspace, resultSet, parameterMap) {
				var checkInDialog = new CheckInDialog();
				checkInDialog.initScanCheckInAction(repository, items,
						callback, teamspace, resultSet, parameterMap);
				checkInDialog.loadDocument(repository, items, callback,
						teamspace, resultSet, parameterMap);
				Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady',
						function() {
							// OnWebTwainReady();
							DWTonReady();
						});
				Dynamsoft.WebTwainEnv.Load();
			});

			lang
					.setObject(
							"scanDocumentUsingTemplate",
							function(repository, items, callback, teamspace,
									resultSet, parameterMap) {
								var addDMSContentItemWithScanDialog = new AddDMSContentItemWithScanDialog();
								addDMSContentItemWithScanDialog
										.initScanActionsWithEnteryTemplate(
												repository, items, callback,
												teamspace, resultSet,
												parameterMap);
								addDMSContentItemWithScanDialog.show(
										repository, null, true, false, null,
										null, true, null);
								addDMSContentItemWithScanDialog
										.set(
												"title",
												Messages.add_document_scan_entery_label);

								Dynamsoft.WebTwainEnv.RegisterEvent(
										'OnWebTwainReady', function() {
											// OnWebTwainReady();
											DWTonReady();
										});
								Dynamsoft.WebTwainEnv.Load();

								// contentItemGeneralPane.onContentSourceTypeChange();
								// scanButton.set("disabled", true);
								// applyScanEntryTemplate(addContentItemDialog);
								// Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady',
								// function(){
								// OnWebTwainReady();
								// DWTonReady();
								// });
								// Dynamsoft.WebTwainEnv.Load();
							});

			lang
					.setObject(
							"addContentItemCustomDialog",
							function(repository, items, callback, teamspace,
									resultSet, parameterMap) {
								var addContentItemCustomDialog = new AddContentItemCustomDialog();
								addContentItemCustomDialog.initAndShowDialog(
										repository, items, callback, teamspace,
										resultSet, parameterMap);
							});

			// // aziz start

			aspect
					.after(
							ecm.widget.ItemSecurityPane.prototype,
							"startup",
							function() {
								console.log("inside startup ItemSecurityPane");
								ready(lang
										.hitch(
												this,
												function() {
													if (this._securityPane._centerPane.childNodes.length > 0) {
														CommonScan
																.hideAdminsFromSecurity(this);
													}
												}));
							});

			aspect.after(ecm.widget.ItemEditPane.prototype,
					"onCompleteRendering", function() {
						console.log("ItemEditPane onCompleteRendering");
						this._itemSecurityPane.render();
					});

			aspect
					.after(
							ecm.widget.ItemSecurityPane.prototype,
							"render",
							function() {
								console.log("ItemSecurityPane render");
								self = this;
								if (this._rendered) {
									if (this._securityPane._centerPane.childNodes.length > 0) {
										CommonScan.hideAdminsFromSecurity(this);
									}
								}

							});

			aspect
					.after(
							ecm.widget.ItemSecurityPane.prototype,
							"onChange",
							function() {
								console.log("Security parameter");
								if (this._rendered) {
									if (this._securityPane._centerPane.childNodes.length > 0) {
										CommonScan.hideAdminsFromSecurity(this);
									}
								}
							});
			aspect.after(ecm.widget.SecurityPane.prototype, "onChange",
					function() {
						console.log("SecurityPane onChange");
						if (this._centerPane.childNodes.length > 0) {
							CommonScan.hideAdminsFromSecurity(this);
						}

					});
			aspect.after(ecm.widget.SecurityPane.prototype,
					"renderPermissions", function() {
						console.log("SecurityPane renderPermissions");
						if (this._centerPane.childNodes.length > 0) {
							CommonScan.hideAdminsFromSecurity(this);
						}

					});
			aspect.after(ecm.widget.SecurityPane.prototype, "_addPermissions",
					function() {
						console.log("SecurityPane _addPermissions");
						if (this._centerPane.childNodes.length > 0) {
							CommonScan.hideAdminsFromSecurity(this);
						}
					});

			// aspect.after(ecm.widget.SecurityPane.prototype,"_onAdd",
			// function() {
			// console.log("SecurityPane _onAdd");
			// if(this._centerPane.childNodes.length > 0){
			// CommonScan.hideAdminsFromSecurity(this);
			// }
			//				
			// });

			// aspect.after(ecm.widget.dialog.AddPermissionDialog.prototype,
			// "_onAdd", function() {
			// // TODO Iterate all childnodes for hide default permission starts
			// console.log("AddPermissionDialog _onAdd");
			// CommonScan.hideAdminsFromSecurity(this);
			//
			//
			// });

			/*
			 * aspect.after(ecm.widget.AddContentItemSecurityPane.prototype,"_onAdd",function() {
			 * console.log("AddContentItemSecurityPane.prototype,_onAdd");
			 * CommonScan.hideAdminsFromSecurity(this); });
			 */
			/*
			 * aspect.after(ecm.widget.SecurityPane.prototype,"onCompleteRendering",function() {
			 * console.log("SecurityPane onCompleteRendering");
			 * CommonScan.hideAdminsFromSecurity(this); });
			 * aspect.after(ecm.widget.AddContentItemSecurityPane.prototype,"buildRendering",function() {
			 * console.log("AddContentItemSecurityPane buildRendering");
			 * CommonScan.hideAdminsFromSecurity(this); });
			 */

			//			
			// aziz end
		});
