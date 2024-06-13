define(
		[
				"dojo/_base/declare",
				"dojo/aspect",
				"dojo/dom",
				"dojo/dom-style",
				"dojo/dom-class",
				"dojo/dom-attr",
				"dojo/_base/lang",
				"dijit/registry",
				"dojo/on",
				"ecm/model/Request",
				"dojo/i18n!scanPluginDojo/scan/scanResources/nls/Messages",
				"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
				"ecm/widget/dialog/AddContentItemDialog"
				,"ecm/model/AttachmentItem", "dojo/json",
				"dojo/_base/json",
				"ecm/model/Desktop", "dojo/request/script",
				"dojox/widget/Toaster",
				"./CommonScan",
				"dojo/text!./templates/AddContentItemWithScanDialog.html" ],
		function(declare, aspect, dom, domStyle, domClass, domAttr, lang,registry,on,
				Request, Messages, _TemplatedMixin, _WidgetsInTemplateMixin,
				AddContentItemDialog,AttachmentItem, JSON, dojojson,Desktop, script, Toaster,CommonScan, template) {
			return declare(
					"scanPluginDojo.scan.AddContentItemWithScanDialog",
					[ AddContentItemDialog ],
					{
						widgetsInTemplate : true,
						contentString : template,
						isWorkItem : false,
						scanButton : null,
						workItem : null,
						workItemResultSet:null,
						workItemWidget : null,
						workItemAttachmentItem : null,
						objectStoreId : null,
						employee : null,
						
						postCreate : function() {
							console.log("addContent Postcreate completed start");
							this.inherited(arguments);
							console.log("addContent Postcreate completed start end");
							
							this._actionButton._setLabelAttr(Messages.add_document_lable);
							
							console.log(this._actionButton);
							// Check user permission for scanning color
//							this.employee= lang.getObject("employeeProfile");
//							if(this.employee.userPermissions.RIGHT_SCAN_COLOR == false){
//								
//								document.getElementById("RGB").style.display="none";
//								document.getElementById("RGBlbl").style.display="none";
//							}
							
							//domStyle.set(this.addContentItemPropertiesPane._documentClassDiv,"display", "none");

						},
						onAdd : function() {

							if (DWObject.HowManyImagesInBuffer == 0) {
								
								registry.byId('scanToaster').setContent(Messages.no_scanned_page, 'fatal');//msrahin
							    registry.byId('scanToaster').show();
								
								return;
							} else {
								var strHostIP = window.location.hostname;
								var intPort = window.location.port;
								var desktop = ecm.model.desktop.id;
								var strActionPage = "/navigator/jaxrs/p8/addItem?desktop=" + desktop;
								var contentSourceType = "Document";
								DWObject.HttpFieldNameOfUploadedImage = "file";
								DWObject.HTTPPort = intPort;
								
								var protocol=window.location.protocol;
								if(protocol == "https:"){
									DWObject.IfSSL = true;	
								}

								var properties = this.addContentItemPropertiesPane.getPropertiesJSON();
								var childComponentValues = this.addContentItemPropertiesPane
										.getChildComponentValues();
								var permissions = this.addContentItemSecurityPane.getPermissions();
								// console.log("this.>>>>>");
								// console.log(addContentItemDialog);
								var parentFolder = this.parentFolder;
								var documentType = this.addContentItemPropertiesPane.getDocumentType();
								// console
								// .log("addContentItemPropertiesPane>>>>>>");
								// console.log(addContentItemPropertiesPane);
								var filename = this.addContentItemPropertiesPane
										.getPropertyValue(this.addContentItemPropertiesPane
												.getTitlePropertyName());

								var addAsMinorVersion = !this.addContentItemGeneralPane
										.getAsMajorVersion();
								var compoundDocument = this._entryTemplate
										&& this._entryTemplate.enableCompoundDocuments
										&& this._entryTemplate.enableCompoundDocuments.on ? true
										: false;
								var objectStore = null;
								if (this.repository._isP8()) {
//									objectStore = (parentFolder && parentFolder.objectStore);
									objectStore=this.repository.objectStore;

									if (!objectStore && this._objectStore) {
										objectStore = this._objectStore;
									}
								}
								var docId = (parentFolder && parentFolder.id)
										|| "";
								var allowDuplicateFileNames = true;
								if (this._entryTemplate) {
									allowDuplicateFileNames = this._entryTemplate.allowDuplicateFileNames;
								}

								var setSecurityParent = (this._teamspace && this.repository
										._isP8());
								if (!setSecurityParent
										&& this._entryTemplate
										&& this._entryTemplate.inheritSecurityFromParentFolder) {
									setSecurityParent = true;
								}
								if (setSecurityParent == null) {
									setSecurityParent = false;
								}
									
								DWObject.SetHTTPFormField("security_token", Request._security_token);
								DWObject.SetHTTPFormField("criterias", dojojson.toJson(properties));
								DWObject.SetHTTPFormField("childComponentValues", dojojson.toJson(childComponentValues));
								DWObject.SetHTTPFormField("acl", dojojson.toJson(permissions));
								DWObject.SetHTTPFormField("desktop", desktop);
								DWObject.SetHTTPFormField("repositoryId", this.repository.id);
								DWObject.SetHTTPFormField("docid", docId);
								DWObject.SetHTTPFormField("parm_content_source_type", contentSourceType);
								DWObject.SetHTTPFormField("template_name", documentType);
								DWObject.SetHTTPFormField("asMinorVersion", addAsMinorVersion);
								DWObject.SetHTTPFormField("compoundDocument", compoundDocument);
								DWObject.SetHTTPFormField("allowDuplicateFileNames", allowDuplicateFileNames);
								DWObject.SetHTTPFormField("set_security_parent", setSecurityParent);
								DWObject.SetHTTPFormField("userId", Desktop.userId);
								DWObject.SetHTTPFormField("numberOfPages", DWObject.HowManyImagesInBuffer)
								DWObject.SetHTTPFormField("sourceId", 1);
								
								osId = this.objectStoreId;
								if (objectStore) {
									osId = objectStore.id;
								}
								
								DWObject.SetHTTPFormField("objectStoreId", osId);

								 osId = this.objectStoreId;
								if (objectStore)
									osId = objectStore.id;
								// console.log("osId:" + osId);
								DWObject
										.SetHTTPFormField("objectStoreId", osId);
								var thisObj = this;
								var sFun = function() {
									return;
								}, fFun = function() {
									var responseText = DWObject.HTTPPostResponseString;
									if (responseText.length > 4 && responseText.substring(0, 4) == "{}&&") {
										responseText = responseText.substring(4); // remove prefix for preventing JavaScript hijacking
									}
									var response = JSON.parse(responseText);
									var itemJSON = response.rows[0];
									if (!itemJSON)
										return;
									var newItem = ecm.model.ContentItem.createFromJSON(itemJSON,thisObj.repository, null,parentFolder);

									if (thisObj._entryTemplate&& thisObj._entryTemplate.workflow) {
										thisObj._startWorkflow(newItem);
									} else if (thisObj.isWorkItem) {
										cl = thisObj.workItemWidget;
										var contentListResultSet = cl.getResultSet();
										var attachment = thisObj.workItemResultSet.parentFolder;
										var attachmentName = attachment.authoredName;
										var attachmentItems = thisObj.workItem.getValue(attachmentName);
										var type = 3; // is document
										if (newItem.isFolder()) {
											type = 2; // this maps to PE attachment item types
										}
										attachment.addAttachment(attachmentItems, newItem,newItem.repository, "",newItem["vsId"], type);
										cl.setResultSet(contentListResultSet);
										attachment.resultSet = contentListResultSet;
										thisObj.generateThumb(newItem);
									}
									contentItemGeneralPane = thisObj.addContentItemGeneralPane;
//									contentItemGeneralPane.contentSourceTypeChoices .splice(0, 1);
								    thisObj.onCancel();
									
									if (thisObj.parentFolder) {
										if (thisObj._entryTemplate) {
											// If the entry template folder matches the currently open desktop folder, refresh 
											// the desktop folder to show the new folder.
											thisObj.parentFolder.refresh();
											if (thisObj._desktopFolder && (thisObj._desktopFolder.id == this.parentFolder.id)) {
												thisObj._desktopFolder.refresh();
											} else {
												// Do nothing, the entry template folder is not the currently opened folder in the desktop.
											}
										} else {
											thisObj.parentFolder.refresh();
										}
									}
								};
								var strImageType = 1;
								for ( var i = 0; i < 4; i++) {
									if (document.getElementsByName("ImageType").item(i).checked == true) {
										strImageType = i + 1;
										break;
									}
								}
								DWObject.TIFFCompressionType = 0;
								DWObject.PDFCompressionType = 0;
								var uploadfilename = filename + "." + document.getElementsByName( "ImageType").item(i).value;
								DWObject.SetHTTPFormField("parm_part_filename", uploadfilename);

								if (strImageType == 1)
									DWObject.SetHTTPFormField("mimetype", "image/jpeg");
								else if (strImageType == 2)
									DWObject.SetHTTPFormField("mimetype", "image/tiff");
								else if (strImageType == 3)
									DWObject.SetHTTPFormField("mimetype", "image/png");
								else
									DWObject.SetHTTPFormField("mimetype", "application/pdf");

								if (strImageType == 2 ) {
									if ((DWObject.SelectedImagesCount == 1)
											|| (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
										DWObject.HTTPUploadAllThroughPostAsMultiPageTIFF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									} else {
										DWObject.HTTPUploadThroughPostAsMultiPageTIFF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									}
								} else if (strImageType == 4 ) {
									if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
										DWObject.HTTPUploadAllThroughPostAsPDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									} else {
										DWObject.HTTPUploadThroughPostAsMultiPagePDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									}
								} else {
									DWObject.HTTPUploadThroughPostEx(strHostIP, DWObject.CurrentImageIndexInBuffer, strActionPage, uploadfilename,
											strImageType, sFun, fFun);
								}
							};
							// console.log("initScanActions action finished");

						},
						onCancel : function() {
							//Dynamsoft.WebTwainEnv.Unload();
							this.scanToaster.destroyRecursive();
							contentItemGeneralPane = this.addContentItemGeneralPane;
							if (contentItemGeneralPane.contentSourceTypeChoices)
								contentItemGeneralPane.contentSourceTypeChoices.splice(0, 1);
							// this._updateUIForSourceType = normal_updateUIForSourceType;
							if (this.propertiesAndScan) {
								this.scanPane.set("content", "");
								this.scanPane.destroyRecursive(true);
							}
							// if (this.addContentItemDialog) {
							// // this.addContentItemDialog.onCancel =
							// normalOnCancel;
							// this.onCancel();
							// }
							this.inherited(arguments);
						},
						applyEntryTemplate : function(renderProperties) {

							var entryTemplateSelected = this._entryTemplate ? true
									: false;
							// These fields are left alone by entry templates
							// associated with folders.
							if (!this._entryTemplateIsFromFolder) {
								this.addContentItemGeneralPane.folderSelector
										.set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._contentSourceType
										.set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._deleteLocalFile
										.set("disabled", !entryTemplateSelected);
								domAttr.set(this.addContentItemGeneralPane._fileInput,"disabled",!entryTemplateSelected);
								if (this.scanButton)
									this.scanButton.set("disabled",!entryTemplateSelected);
							} else {
								if (this._entryTemplate
										&& this._entryTemplate.currentFolderAsParent) {
									this.parentFolder = this._originalFolder;
								}
							}
							if (this.repository._isP8()) {
								this.addContentItemGeneralPane._majorVersion
										.set("disabled", !entryTemplateSelected);
								if (entryTemplateSelected) {
									domClass
											.remove(
													this.addContentItemGeneralPane._majorVersionLabel,
													"labelReadOnly");
								} else {
									domClass
											.add(
													this.addContentItemGeneralPane._majorVersionLabel,
													"labelReadOnly");
								}
							}

							if (this._entryTemplate) {
								if (this.repository._isP8()
										|| this.repository._isCM()) {
									var workflow = this._entryTemplate.workflow;
									if (workflow) {
										if (workflow.promptToLaunchWorkflow
												&& !this._isWorkflowRunning) {
											domStyle
													.set(
															this.addContentItemGeneralPane._majorVersionStartWorkflowDiv,
															"display", "");
											this
													._displayEntryTemplatePromptLaunchWorkflow(
															"", false);
											this.addContentItemGeneralPane
													.setStartOnWorkflow(true);
										} else {
											this
													._displayEntryTemplatePromptLaunchWorkflow(
															"none", true);
										}
									} else {
										this
												._displayEntryTemplatePromptLaunchWorkflow(
														"none", true);
									}
								}

								if (this._entryTemplate.type != ecm.model.EntryTemplate.TYPE.FOLDER) {
									if (this._repositoryDocumentMode) {
										var choices = [];
										choices.push("RepositoryDocument");
										this.addContentItemGeneralPane
												.addContentSourceTypeChoices(choices);
										domStyle
												.set(
														this.addContentItemGeneralPane._contentSourceTypeDiv,
														"display", "none");
										domStyle
												.set(
														this.addContentItemGeneralPane._fileInputArea,
														"display", "none");

									} else {
										if (this._entryTemplate.allowUserSelectSaveChoice
												&& !this.addContentItemGeneralPane
														.hasExternalFiles()) {
											domStyle
													.set(
															this.addContentItemGeneralPane._contentSourceTypeDiv,
															"display", "");
										} else {
											domStyle
													.set(
															this.addContentItemGeneralPane._contentSourceTypeDiv,
															"display", "none");
										}
										var choices = [];
										if (this._entryTemplate.allowSaveLocalDocument) {
											choices.push("Scan");
											choices.push("Document");
										}
										if (this._entryTemplate.allowSavePropertiesOnly) {
											choices.push("Item");
										}
										if (this.repository._isP8()) {
											if (this._entryTemplate.allowSaveExternalDocumentLink) {
												choices.push("ExternalURL");
											}
										}
										this.addContentItemGeneralPane
												.addContentSourceTypeChoices(choices);
									}
								}
							}

							this.addContentItemPropertiesTitlePane.set(
									"disabled", !entryTemplateSelected);
							this.addContentItemPropertiesPane._contentClassNameTextBox
									.set("disabled", !entryTemplateSelected);
							this.addContentItemSecurityTitlePane.set(
									"disabled", !entryTemplateSelected);

							if (this.addContentItemPropertiesPane._contentClassTooltip) {
								this.addContentItemPropertiesPane._contentClassTooltip
										.set("label", "");
							}
							this.addContentItemPropertiesPane._contentClassNameTextBox
									.set("value", "");

							// Clear any error message.
							this._clearErrorMessage();

							if (!entryTemplateSelected) {
								this.addContentItemPropertiesPane
										.setContentClass(null);
								this.addContentItemPropertiesPane
										.clearRendering();
								this.addContentItemSecurityPane._contentClass = null;
								this.addContentItemSecurityPane._securityPane
										.reset();
								return;
							}

							if (this.repository._isP8()) {
								// Present messages if this entry template
								// supports declaring records.
								var declareRecord = this._entryTemplate.declareRecord;
								if (declareRecord
										&& (declareRecord != "")
										&& (declareRecord != ecm.model.EntryTemplate.DECLARE.NEVER_DECLARE)) {
									if (declareRecord == ecm.model.EntryTemplate.DECLARE.ALWAYS_DECLARE) {
										this
												.setMessage(
														this._messages.add_document_using_always_declare_template_warning,
														"warning");
									} else {
										this
												.setMessage(
														this._messages.add_document_using_optional_declare_template_info,
														"info");
									}
								}
							}

							// If there is no entry template list or only one
							// entry template in the list, and this is not a
							// folder
							// association entry template list, then show the
							// entry template name text box instead of the entry
							// template selector.
							if ((!this._entryTemplates || this._entryTemplates.length == 1)
									&& !this._entryTemplateIsFromFolder) {
								this.addContentItemGeneralPane
										.showEntryTemplateNameTextBox(this._entryTemplate);
							} else {
								// Create the entry template tooltip and
								// associate it with the entry template selector
								// here
								// so as not to override the required tooltip
								// message that is displayed when an entry
								// template
								// has not been selected.
								this.addContentItemGeneralPane
										.createEntryTemplateSelectorTooltip(this._entryTemplate);
							}

							// Leave the folder location alone if this is for an
							// existing item (checkin),
							// or if the entry template is associated with the
							// current folder.
							if (this._entryTemplate) {
								if (!this._item
										&& (!this._entryTemplateIsFromFolder || !this._entryTemplate.currentFolderAsParent)) {
									this.parentFolder = this._entryTemplate.folder;
									if (this.repository._isP8()) {
										this._objectStore = this._entryTemplate.objectStore;
										if (this._entryTemplate.targetRepository) {
											this.repository = this._entryTemplate.targetRepository;
										}
									}
									var folderForTeamspace = this.parentFolder;
									if (folderForTeamspace == null) {
										folderForTeamspace = this._originalFolder;
									}
									var checkForTeamspace = folderForTeamspace
											&& folderForTeamspace.repository
											&& folderForTeamspace.repository.teamspacesEnabled;
									if (checkForTeamspace) {
										this.addContentItemGeneralPane.folderSelector.preventSelectRoot = false;
										folderForTeamspace
												.retrieveTeamspace(lang
														.hitch(
																this,
																function(
																		teamspace) {
																	this._teamspace = teamspace;
																	// if
																	// (teamspace
																	// &&
																	// this.parentFolder
																	// &&
																	// teamspace.id
																	// ==
																	// this.parentFolder.id)
																	// {
																	// this.parentFolder
																	// = null;
																	// }
																	this
																			._applyEntryTemplateFolderSelector();
																	this
																			._finishApplyEntryTemplate(renderProperties);
																}));
									} else {
										this._teamspace = null;
										this
												._applyEntryTemplateFolderSelector();
										this
												._finishApplyEntryTemplate(renderProperties);
									}
								} else {
									this
											._finishApplyEntryTemplate(renderProperties);
								}
							}

						},
						onAcquire : function() {
							
					
							
							{
								var sourceCount = DWObject.SourceCount;
								if (sourceCount == 0)
									return;

								if (_last_selected_index === -1) {
									_last_selected_index = document
											.getElementById("source").selectedIndex;
								}

								var _obj = {};
								_obj.SelectSourceByIndex = _last_selected_index;
								_obj.IfShowUI = document
										.getElementById("ShowUI").checked;

								for ( var i = 0; i < 3; i++) {
									if (document.getElementsByName("PixelType")
											.item(i).checked === true) {
										_obj.PixelType = i;
										break;
									}
									pageonload
								}
								_obj.Resolution = document
										.getElementById("Resolution").value;
								_obj.IfFeederEnabled = document
										.getElementById("ADF").checked;
								_obj.IfDuplexEnabled = document.getElementById("Duplex").checked;
								// if (DynamLib.env.bWin)
								// g_DWT_PrintMsg("Pixel Type: " +
								// _obj.PixelType
								// + "<br />Resolution: " + _obj.Resolution);

								_obj.IfDisableSourceAfterAcquire = true;

								// _iTwainType = 0;

								acquireImage();

							}
						},initScanDeliveryActions : function(repository,documentClass,filename,DeliveryReportId,hijricYear,type) {
							 
							
							console.log("initScanActions action is starting");
							
							this.scanButton = null;
							var contentItemGeneralPane = this.addContentItemGeneralPane;
							if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
								contentItemGeneralPane.contentSourceTypeChoices
										.splice(0,0,{
													value : "Scan",
													label : Messages.add_document_scan_label
												});
								contentItemGeneralPane._contentSourceType.value = "Scan";
							}

							thisObj = this;
							
							contentItemGeneralPane._updateUIForSourceType = function(sourceType) {
								
								if (sourceType == "Item") {
									domStyle.set(contentItemGeneralPane._fileInputArea,	"display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"),"display", "none");
									thisObj._actionButton.set("disabled",!thisObj.isValid(false));
									thisObj.scanButton.destroy();
								} else if (sourceType == "ExternalURL") {
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv,"display", "");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else if (sourceType == "Document") { // "Document"
									// file
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else { // Scan
									domStyle .set( contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "");
									thisObj._actionButton .set("disabled", false);
									if (thisObj.scanButton == null) {
										thisObj.scanButton = thisObj.addButton(Messages.add_document_scan_button, "onAcquire", true, true, "ScanButton");
										thisObj.scanButton.set("disabled", false);
									}
								}
								
							};

							if (repository && repository.objectStoreId) {
								this.objectStoreId = repository.objectStoreId;
							}
							
							this.show(repository, repository, true);
							this.set("title", Messages.add_document_scan_label);
							
							contentItemGeneralPane.onContentSourceTypeChange(); // Amr code
							
							domStyle.set(contentItemGeneralPane._contentSourceTypeDiv,"pointer-events", "none");
							domStyle.set(this.addContentItemPropertiesPane._documentClassDiv,"display", "none");
							
							this.addContentItemPropertiesPane._contentClassSelector.onLoaded=lang.hitch(this,function() {   
								this.addContentItemPropertiesPane._contentClassSelector.setSelected("DeliveryReportDocument");
							});
							
							aspect.after(this.addContentItemPropertiesPane, "onCompleteRendering", lang.hitch(this, function() {
								this.addContentItemPropertiesPane._contentClassSelector.setDisabled(true);
								
								this.addContentItemPropertiesPane.setPropertyValue(this.addContentItemPropertiesPane.getTitlePropertyName(),filename);
								this.addContentItemPropertiesPane.setPropertyValue( "DeliveryReportId" ,DeliveryReportId);
								this.addContentItemPropertiesPane.setPropertyValue( "DeliveryReportHijricYear" ,hijricYear);
								this.addContentItemPropertiesPane.setPropertyValue( "DeliveryReportType" ,type);
								
							}));
							

						},
						initScanActionsWithEnteryTemplate : function(repository, items, callback, teamspace, resultSet, parameterMap) {
							
							console.log("initScanActions action is starting");
							this.scanButton = null;
							var contentItemGeneralPane = this.addContentItemGeneralPane;
							if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
								contentItemGeneralPane.contentSourceTypeChoices
										.splice(0,0,{
													value : "Scan",
													label : Messages.add_document_scan_label
												});
								contentItemGeneralPane._contentSourceType.value = "Scan";
							}
							console.log("before: "+ contentItemGeneralPane.getContentSourceType());
							thisObj = this;
							console.log("thisObj>>>>");
							console.log(thisObj);
							contentItemGeneralPane._updateUIForSourceType = function(sourceType) {
								
								if (sourceType == "Item") {
									domStyle.set(contentItemGeneralPane._fileInputArea,	"display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"),"display", "none");
									thisObj._actionButton.set("disabled",!thisObj.isValid(false));
									thisObj.scanButton.destroy();
								} else if (sourceType == "ExternalURL") {
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv,"display", "");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else if (sourceType == "Document") { // "Document"
									// file
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else { // Scan
									domStyle .set( contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "");
									thisObj._actionButton .set("disabled", false);
									if (thisObj.scanButton == null) {
										thisObj.scanButton = thisObj.addButton(Messages.add_document_scan_button, "onAcquire", true, true, "ScanButton");
										thisObj.scanButton.set("disabled", false);
									}
								}
								
							};

							// initLabels();

							if (repository && repository.objectStoreId) {
								this.objectStoreId = repository.objectStoreId;
							}
							if (items != null && items[0].isFolder())
								this.show(repository, items[0], true);
							else if (items != null && items[0] && (items[0]).isInstanceOf(ecm.model.AttachmentItem)) {
								this.workItemAttachmentItem = items[0];
								this.workItem = items[0].parent;
								this.isWorkItem = this.workItem && this.workItem.isInstanceOf(ecm.model.WorkItem);
								this.workItemResultSet = resultSet;
								this.workItemWidget = parameterMap.widget;
								this.show(repository, items[0], true);
							} else
								this.show(repository, repository, true);
							this.set("title", Messages.add_document_scan_label);
							contentItemGeneralPane.onContentSourceTypeChange();
//							var preview = registry.byId("DW_PreviewMode");
//							 this.setlPreviewMode(preview);
//							on(preview, "change", lang.hitch(this,function(evt) {
//								this.setlPreviewMode(preview);
//							}));
							
							
							console.log("scan action started successfully");

						},
						initScanActions : function(repository, items, callback, teamspace, resultSet, parameterMap, webtwain_install,webtwain_initiate,webtwain_config) {
//							script .get("plugin/DMSScanPlugin/getResource/scanPluginDojo/scan/scanResources/DWT/dynamsoft.webtwain.config.js");
//							if(Dynamsoft.WebTwainEnv)
//								Dynamsoft.WebTwainEnv.Load();
							console.log("initScanActions action is starting");
							this.scanButton = null;
							var contentItemGeneralPane = this.addContentItemGeneralPane;
							if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
								contentItemGeneralPane.contentSourceTypeChoices.splice(0,0,{
													value : "Scan",
													label : Messages.add_document_scan_label
												});
								contentItemGeneralPane._contentSourceType.value = "Scan";
							}
							console.log("before: "+ contentItemGeneralPane.getContentSourceType());
							thisObj = this;
							console.log("thisObj>>>>");
							console.log(thisObj);
							contentItemGeneralPane._updateUIForSourceType = function(sourceType) {
								
								if (sourceType == "Item") {
									domStyle.set(contentItemGeneralPane._fileInputArea,	"display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"),"display", "none");
									thisObj._actionButton.set("disabled",!thisObj.isValid(false));
									thisObj.scanButton.destroy();
								} else if (sourceType == "ExternalURL") {
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle.set(contentItemGeneralPane._externalURLDiv,"display", "");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else if (sourceType == "Document") { // "Document"
									// file
									domStyle.set(contentItemGeneralPane._fileInputArea, "display", "");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "none");
									thisObj._actionButton.set("disabled", !thisObj.isValid(false));
									thisObj.scanButton.destroy();

								} else { // Scan
									domStyle .set( contentItemGeneralPane._fileInputArea, "display", "none");
									domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
									domStyle.set(dom.byId("container"), "display", "");
									thisObj._actionButton .set("disabled", false);
									if (thisObj.scanButton == null) {
										thisObj.scanButton = thisObj.addButton(Messages.add_document_scan_button, "onAcquire", true, true, "ScanButton");
										thisObj.scanButton.set("disabled", false);
									}
								}
								
							};

							// initLabels();

							if (repository && repository.objectStoreId) {
								this.objectStoreId = repository.objectStoreId;
							}
							if (items != null && items[0].isFolder())
								this.show(repository, items[0], true);
							else if (items != null && items[0] && (items[0]).isInstanceOf(ecm.model.AttachmentItem)) {
								this.workItemAttachmentItem = items[0];
								this.workItem = items[0].parent;
								this.isWorkItem = this.workItem && this.workItem.isInstanceOf(ecm.model.WorkItem);
								this.workItemResultSet = resultSet;
								this.workItemWidget = parameterMap.widget;
								this.show(repository, items[0], true);
							}else if(resultSet && resultSet.parentFolder != null && (resultSet.parentFolder).isInstanceOf(ecm.model.AttachmentItem)){
								
								//this.workItemAttachmentItem = items[0];
								//this.workItem = items[0].parent;
								
								this.workItemAttachmentItem = resultSet.parentFolder;
								this.workItem = resultSet.parentFolder.parent;
								
								this.isWorkItem = this.workItem && this.workItem.isInstanceOf(ecm.model.WorkItem);
								this.workItemResultSet = resultSet;
								this.workItemWidget = parameterMap.widget;
								
								this.show(repository,this.workItemAttachmentItem, true);
								
							}else
								this.show(repository, repository, true);
							this.set("title", Messages.add_document_scan_label);
							contentItemGeneralPane.onContentSourceTypeChange();
							
							this.addContentItemPropertiesPane._contentClassSelector.onLoaded=lang.hitch(this,function() {   
								this.addContentItemPropertiesPane._contentClassSelector.setSelected("RegulatoryDocuments");
							
							});
							
							if(this.workItem){
								var workItemAttributes = this.workItem.attributes;
								var correspondenceNo= workItemAttributes.SequenceNumber;
								var hijricYear= workItemAttributes.HijricYear;
								var itemType= workItemAttributes.ItemType;
							}
							
							aspect.after(this.addContentItemPropertiesPane, "onCompleteRendering", lang.hitch(this, function() {
								
								domStyle.set(contentItemGeneralPane._contentSourceTypeDiv,"pointer-events", "none");
								domStyle.set(contentItemGeneralPane._documentOnlyArea,"pointer-events", "none");
								
								//this.addContentItemPropertiesPane._contentClassSelector.setDisabled(true);
								
								if(this.workItem){
									var subject=this.workItem.attributes.F_Subject;
									this.addContentItemPropertiesPane.setPropertyValue(this.addContentItemPropertiesPane.getTitlePropertyName(),subject.substring(0,100));
								}
								contentItemGeneralPane._majorVersion.setDisabled(true);
								//TODO Test if correspondeceIds are getting set
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceIds" ,correspondenceNo+","+hijricYear+","+itemType+";");
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceNumber" ,correspondenceNo);
								this.addContentItemPropertiesPane.setPropertyValue( "HijricYear" ,hijricYear);
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceType" ,itemType);
							
								
//								CommonScan.hideAdminsFromSecurity(this.addContentItemSecurityPane);
							}));
							aspect.after(this.addContentItemSecurityPane._securityPane,"renderPermissions",lang.hitch(this,function() {
								
							}));
//							aspect.after(this.addContentItemSecurityPane._securityPane ,"renderPermissions",lang.hitch(this,function() {
//								console.log("onCompleteRendering.............");
//								CommonScan.hideAdminsFromSecurity(this.addContentItemSecurityPane._securityPane);
//							}));
//							aspect.after(this.addContentItemSecurityPane,"onCompleteRendering",lang.hitch(this,function() {
//								console.log("onCompleteRendering.............");
//								CommonScan.hideAdminsFromSecurity(this.addContentItemSecurityPane);
//							}));
//							var preview = registry.byId("DW_PreviewMode");
//							 this.setlPreviewMode(preview);
//							on(preview, "change", lang.hitch(this,function(evt) {
//								this.setlPreviewMode(preview);
//							}));

							
							console.log("scan action started successfully");

						},generateThumb : function (newItem) {
							// var params1 = newItem.getPageImageUrl(1, -3, 0, false, 1.0, 1.0, 200, 200);
							var _thumbnailRequestItem;

							if (_thumbnailRequestItem == null || (this._thumbnailRequest != null && this._thumbnailRequest.getReadyState() == 4)) {
								_thumbnailRequestItem = newItem;
								this._nextThumbnailItem = null;
								var params = newItem.getPageImageRequestParameters(1, -3,
										0, false, 1.0, 1.0, 200, 200);
								params.jsonRequest = true;
								var thumbnail = new Object();
								thumbnail.mimeType = newItem.mimetype;
								this._thumbnailRequest = ecm.model.Request.invokeService("getPageImage","",params,lang.hitch(this, function(response) {
													thumbnail.image = response.image;
													newItem.attributes.thumbnail = JSON
															.stringify(thumbnail);
													newItem.update(newItem);
												}),false,false,lang.hitch(this, function(response) {
																	thumbnail.image = Desktop.getServicesUrl()+ "/ecm/widget/resources/images/spacer.gif";
																}), true);
							}

						},setlPreviewMode : function(preview) {
							if (DWObject) {
								DWObject.SetViewMode(parseInt(preview.value) + 1, parseInt(preview.value) + 1);
								if (DynamLib.env.bMac) {
									return;
								} else if (parseInt(preview.value) != 0) {
									DWObject.MouseShape = true;
								} else {
									DWObject.MouseShape = false;
								}
							}
						}
					});

		});