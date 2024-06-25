define(
		[
				"dojo/_base/declare",

				"dojo/_base/lang",
				"dojo/aspect",
				"ecm/model/Request",
				"dojo/dom",
				"dojo/dom-style",
				"dojo/dom-attr",
				"dojo/dom-class",
				"dijit/registry",
				"dojo/on",
				"dijit/_TemplatedMixin",
				"dijit/_WidgetsInTemplateMixin", "ecm/model/AttachmentItem",

				"ecm/widget/dialog/CheckInDialog",
				"dojo/i18n!scanPluginDojo/scan/scanResources/nls/Messages",
				"dojo/json", "dojo/_base/json",
				"ecm/model/Desktop",
				"dojo/text!./templates/AddContentItemWithScanDialog.html" ],
		function(declare, lang, aspect, Request, dom, domStyle, domAttr,
				domClass,registry,on,  _TemplatedMixin, _WidgetsInTemplateMixin,
				AttachmentItem,CheckInDialog, Messages, JSON, dojojson,Desktop, template) {
			return declare("scanPluginDojo.scan.CheckInWithScanDialog",[ CheckInDialog ],
					{
				
						widgetsInTemplate : true,
						contentString : template,
						isWorkItem : false,
						item : null,
						objectStoreId : null,
						workItem : null,
						workItemResultSet:null,
						workItemWidget : null,
						workItemAttachmentItem : null,
						
						postCreate : function() {
							this.inherited(arguments);
							// Check user permission for scanning color
//							this.employee= lang.getObject("employeeProfile");
//							if(this.employee.userPermissions.RIGHT_SCAN_COLOR == false){
//								
//								document.getElementById("RGB").style.display="none";
//								document.getElementById("RGBlbl").style.display="none";
//							}	
							},
						/*show : function(repository, item, callback, teamspace,
								entryTemplate, repositoryDocumentMode) {
							this.inherited(arguments);
						},*/
						onCheckin : function() {
							console.log("onCheckin");
							if (DWObject.HowManyImagesInBuffer == 0) {
								alert("There is no scanned page");
								return;
							} else {
								var strHostIP = window.location.hostname;
								var intPort = window.location.port;
								var desktop = ecm.model.desktop.id;
								var strActionPage = "/navigator/jaxrs/p8/checkIn?desktop=" + desktop;
								var contentSourceType = "Document";
								DWObject.HttpFieldNameOfUploadedImage = "file";
								DWObject.HTTPPort = intPort;
								var protocol=window.location.protocol;
								if(protocol == "https:"){
									DWObject.IfSSL = true;	
								}
								
								
								var properties = this.addContentItemPropertiesPane.getPropertiesJSON();
								var childComponentValues = this.addContentItemPropertiesPane.getChildComponentValues();
								var permissions = this.addContentItemSecurityPane .getPermissions();
								var parentFolder = this.parentFolder;
								var documentType = this.addContentItemPropertiesPane .getDocumentType();
								var filename = this.addContentItemPropertiesPane.getPropertyValue(this.addContentItemPropertiesPane.getTitlePropertyName());
								var addAsMinorVersion = !this.addContentItemGeneralPane .getAsMajorVersion();
								var autoClassify = this.addContentItemGeneralPane .getAutoClassify();
								var objectStore = null;
								if (this.repository._isP8()) {
									objectStore = (parentFolder && parentFolder.objectStore);
									if (!objectStore && this._objectStore) {
										objectStore = this._objectStore;
									}
								}
								var docId = this.item.id;
								DWObject.SetHTTPFormField("security_token", Request._security_token);
								DWObject.SetHTTPFormField("criterias", dojojson.toJson(properties));
								DWObject.SetHTTPFormField("childComponentValues", dojojson.toJson(childComponentValues));
								DWObject.SetHTTPFormField("acl", dojojson.toJson(permissions));
								DWObject.SetHTTPFormField("desktop", desktop);
								DWObject.SetHTTPFormField("repositoryId",this.repository.id);
								DWObject.SetHTTPFormField("docid", docId);
								DWObject.SetHTTPFormField("parm_content_source_type", contentSourceType);
								DWObject.SetHTTPFormField("template_name", documentType);
								DWObject.SetHTTPFormField("asMinorVersion", addAsMinorVersion);
								DWObject.SetHTTPFormField("autoClassify", autoClassify);
								DWObject.SetHTTPFormField("sourceId", 4);
								DWObject.SetHTTPFormField("numberOfPages", DWObject.HowManyImagesInBuffer);
								DWObject.SetHTTPFormField("oldDocId", this.oldDocumentId);
								DWObject.SetHTTPFormField("properties", JSON.stringify(properties));


								osId = this.objectStoreId;
								if (objectStore)
									osId = objectStore.id;

								DWObject.SetHTTPFormField("objectStoreId", osId);
								var thisObj = this;
								var sFun = function() {
									return;
								};	
								var fFun = function(){
									if ((thisObj._entryTemplate && thisObj._entryTemplate.workflow) || thisObj.isWorkItem) {
										var responseText = DWObject.HTTPPostResponseString;
										if (responseText.length > 4 && responseText.substring(0, 4) == "{}&&") {
											responseText = responseText .substring(4);
											// remove prefix for preventing JavaScript  hijacking
										}										
										var response = JSON.parse(responseText);
										var itemJSON = response.rows[0];
										if (!itemJSON)
											return;
										var updatedItem = ecm.model.ContentItem.createFromJSON(itemJSON, thisObj.repository, null, null);

										if (thisObj.isWorkItem) {
											thisObj.workItemAttachmentItem.update(updatedItem);
											thisObj.generateThumb(updatedItem);
										}
										if (thisObj._entryTemplate && thisObj._entryTemplate.workflow)
											thisObj._startWorkflow(updatedItem);
									}
//									contentItemGeneralPane = thisObj.addContentItemGeneralPane;thisObj.onCancel();
//									contentItemGeneralPane.contentSourceTypeChoices .splice(0, 1);
//									thisObj.scanPane.set("content", "");
//									thisObj.scanPane.destroyRecursive(true);
									thisObj.onCancel();
									
									if (thisObj.parentFolder) {
										if (thisObj._entryTemplate) {
											// If the entry template folder matches the currently open desktop folder,
											// refresh the desktop folder to show the new folder.
											if (thisObj._desktopFolder && (thisObj._desktopFolder.id == thisObj.parentFolder.id)) {
												thisObj._desktopFolder.refresh();
											} else {
											// Do nothing, the entry template folder is not the currently opened folder in the desktop.
											}
											if(thisObj.parentFolder && !thisObj.parentFolder.showInSearchView)
												thisObj.parentFolder.refresh();
											else if(thisObj._resultSet)
												thisObj._resultSet.refresh();
											
										} else {
											if(thisObj.parentFolder && !thisObj.parentFolder.showInSearchView)
												thisObj.parentFolder.refresh();
											else if(thisObj._resultSet)
												thisObj._resultSet.refresh();
										}
									}

								
								};
								var strImageType = 1;
								for ( var i = 0; i < 4; i++) {
									if (document.getElementsByName("ImageType") .item(i).checked == true) {
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
									DWObject.SetHTTPFormField("mimetype", 	"image/png");
								else
									DWObject.SetHTTPFormField("mimetype", "application/pdf");

								DWObject.SetHTTPFormField("mimetype", "application/pdf");
								DWObject.HTTPUploadAllThroughPostAsPDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);

								
/*								
								if (strImageType == 2) {
									if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
										DWObject.HTTPUploadAllThroughPostAsMultiPageTIFF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									} else {
										DWObject.HTTPUploadThroughPostAsMultiPageTIFF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									}
								} else if (strImageType == 4 ) {
									if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
										DWObject.HTTPUploadAllThroughPostAsPDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
									} else {
										DWObject.HTTPUploadThroughPostAsMultiPagePDF(strHostIP, strActionPage, uploadfilename, sFun, fFun );
									}
								} else {
									DWObject.HTTPUploadThroughPostEx(strHostIP, DWObject.CurrentImageIndexInBuffer, strActionPage, uploadfilename, strImageType, sFun, fFun);
								}*/
							}
							//thisObj.inherited(arguments);
							console.log("initScanActions action finished");
						},
						onCancel : function() {
							if(this.scanToaster)
								this.scanToaster.destroyRecursive();
							contentItemGeneralPane = this.addContentItemGeneralPane;
							if (contentItemGeneralPane.contentSourceTypeChoices)
								contentItemGeneralPane.contentSourceTypeChoices.splice(0, 1);
							// contentItemGeneralPane._updateUIForSourceType =
							// normal_updateUIForSourceType;
							// checkInDialog.applyEntryTemplate = normalApplyEntryTemplate;
							// checkInDialog.showCheckin = normalShowCheckin;
							// scanPane.setContent("");
							// scanPane.destroyRecursive(true);
							// checkInDialog.onCancel = normalOnCancel;
							// checkInDialog.onCancel();
							Dynamsoft.WebTwainEnv.Unload();

							if (this.scanPane) {
								this.scanPane.set("content", "");
								this.propertiesAndScan.destroyRecursive(true);
							}
							this.inherited(arguments);
						},
						_resultSet:null
						,
						initScanCheckInAction : function(repository, items, callback, teamspace, resultSet, parameterMap) {
							this._resultSet = resultSet;
							console.log("initScanChecInAction  is starting");
							this.item = items[0];
							contentItemGeneralPane = this.addContentItemGeneralPane;
							addContentItemPropertiesPane = this.addContentItemPropertiesPane;
							aspect.after(this.addContentItemPropertiesPane._contentClassSelector, "onLoaded",
									lang.hitch(this, function(){
										this.addContentItemPropertiesPane._contentClassSelector.setDisabled(true);	
							}));
							scanButton = null;
							thisObj = this;
							if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
								contentItemGeneralPane.contentSourceTypeChoices .splice( 0, 0, {
													value : "Scan",
													label : Messages.add_document_scan_label
												});
								contentItemGeneralPane._contentSourceType.value = "Scan";
							}
							if (scanButton == null) {
								scanButton = thisObj .addButton( Messages.add_document_scan_button, "onAcquire", true, true, "ScanButton");
								scanButton.set( "disabled", false);
							}
							aspect .after( contentItemGeneralPane, "_updateUIForSourceType", function(sourceType) {
												var scanContainer = dom .byId("container");
												if (!sourceType)
													sourceType = contentItemGeneralPane.getContentSourceType();
												if (sourceType != "Scan") {
													if (scanContainer)
														domStyle.set( scanContainer, "display", "none");
//													var preview = registry.byId("DW_PreviewMode");
//													thisObj.setlPreviewMode(preview);
//													on(preview, "change", lang.hitch(thisObj,function(evt) {
//														this.setlPreviewMode(preview);
//													}));
													return;
												} else {
													domStyle.set(contentItemGeneralPane._fileInputArea, "display", "none");
													domStyle .set( contentItemGeneralPane._externalURLDiv, "display", "none");
													if (scanContainer)
														domStyle.set( scanContainer, "display", "");
													thisObj._actionButton.set( "disabled", false);
													if (scanButton == null) {
														scanButton = thisObj .addButton( Messages.add_document_scan_button, "onAcquire", true, true, "ScanButton");
														scanButton.set( "disabled", false);
													}

												}
											});
							// contentItemGeneralPane._updateUIForSourceType =
							// function(
							// sourceType) {
							// alert(sourceType);
							// if (sourceType == "Item") {
							// domStyle
							// .set(
							// contentItemGeneralPane._fileInputArea,
							// "display", "none");
							// domStyle
							// .set(
							// contentItemGeneralPane._externalURLDiv,
							// "display", "none");
							// domStyle.set(dom.byId("container"),
							// "display", "none");
							// // this.onCheckin = normalOnCheckin;
							// thisObj._actionButton.set("disabled", !this
							// .isValid(false));
							// if (scanButton != null)
							// scanButton.destroy();
							// scanButton = null;
							//
							// } else if (sourceType == "ExternalURL") {
							// domStyle
							// .set(
							// contentItemGeneralPane._fileInputArea,
							// "display", "none");
							// domStyle
							// .set(
							// contentItemGeneralPane._externalURLDiv,
							// "display", "");
							// domStyle.set(dom.byId("container"),
							// "display", "none");
							// // this.onCheckin = normalOnCheckin;
							// thisObj._actionButton.set("disabled",
							// !thisObj.isValid(false));
							// if (scanButton != null)
							// scanButton.destroy();
							// scanButton = null;
							//
							// } else if (sourceType == "Document") { //
							// "Document"
							// // file
							// domStyle
							// .set(
							// contentItemGeneralPane._fileInputArea,
							// "display", "");
							// domStyle
							// .set(
							// contentItemGeneralPane._externalURLDiv,
							// "display", "none");
							// domStyle.set(dom.byId("container"),
							// "display", "none");
							// // checkInDialog.onCheckin =
							// // normalOnCheckin;
							// thisObj._actionButton.set("disabled",
							// !thisObj.isValid(false));
							// if (scanButton != null)
							// scanButton.destroy();
							// scanButton = null;
							// } else { // Scan
							// domStyle
							// .set(
							// contentItemGeneralPane._fileInputArea,
							// "display", "none");
							// domStyle
							// .set(
							// contentItemGeneralPane._externalURLDiv,
							// "display", "none");
							// domStyle.set(dom.byId("container"),
							// "display", "");
							// // checkInDialog.onCheckin = scanOnCheckin;
							// thisObj._actionButton
							// .set("disabled", false);
							// if (scanButton == null) {
							// scanButton = thisObj
							// .addButton(
							// Messages.add_document_scan_button,
							// "onAcquire", true,
							// true, "ScanButton");
							// scanButton.set("disabled", false);
							// }
							// }
							//
							// };
						},
						applyEntryTemplate : function(renderProperties) {
							this.inherited(arguments);
							if (this.scanButton)
								this.scanButton.set("disabled", !entryTemplateSelected);

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
									this.addContentItemGeneralPane .addContentSourceTypeChoices(choices);
							/*

							var entryTemplateSelected = this._entryTemplate ? true : false;
							// These fields are left alone by entry templates
							// associated with folders.
							if (!this._entryTemplateIsFromFolder) {
								this.addContentItemGeneralPane.folderSelector .set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._contentSourceType .set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._deleteLocalFile .set("disabled", !entryTemplateSelected);
								domAttr .set( this.addContentItemGeneralPane._fileInput, "disabled", !entryTemplateSelected);
								if (this.scanButton)
									this.scanButton.set("disabled", !entryTemplateSelected);
							} else {
								if (this._entryTemplate && this._entryTemplate.currentFolderAsParent) {
									this.parentFolder = this._originalFolder;
								}
							}
							if (this.repository._isP8()) {
								this.addContentItemGeneralPane._majorVersion .set("disabled", !entryTemplateSelected);
								if (entryTemplateSelected) {
									domClass .remove( this.addContentItemGeneralPane._majorVersionLabel, "labelReadOnly");
								} else {
									domClass .add( this.addContentItemGeneralPane._majorVersionLabel, "labelReadOnly");
								}
							}

							if (this._entryTemplate) {
								if (this.repository._isP8() || this.repository._isCM()) {
									var workflow = this._entryTemplate.workflow;
									if (workflow) {
										if (workflow.promptToLaunchWorkflow && !this._isWorkflowRunning) {
											domStyle .set( this.addContentItemGeneralPane._majorVersionStartWorkflowDiv, "display", "");
											this ._displayEntryTemplatePromptLaunchWorkflow( "", false);
											this.addContentItemGeneralPane .setStartOnWorkflow(true);
										} else {
											this ._displayEntryTemplatePromptLaunchWorkflow( "none", true);
										}
									} else {
										this ._displayEntryTemplatePromptLaunchWorkflow( "none", true);
									}
								}

								if (this._entryTemplate.type != ecm.model.EntryTemplate.TYPE.FOLDER) {
									if (this._repositoryDocumentMode) {
										var choices = [];
										choices.push("RepositoryDocument");
										this.addContentItemGeneralPane .addContentSourceTypeChoices(choices);
										domStyle .set( this.addContentItemGeneralPane._contentSourceTypeDiv, "display", "none");
										domStyle .set( this.addContentItemGeneralPane._fileInputArea, "display", "none");

									} else {
										if (this._entryTemplate.allowUserSelectSaveChoice && !this.addContentItemGeneralPane .hasExternalFiles()) {
											domStyle .set( this.addContentItemGeneralPane._contentSourceTypeDiv, "display", "");
										} else {
											domStyle .set( this.addContentItemGeneralPane._contentSourceTypeDiv, "display", "none");
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
										this.addContentItemGeneralPane .addContentSourceTypeChoices(choices);
									}
								}
							}

							this.addContentItemPropertiesTitlePane.set( "disabled", !entryTemplateSelected);
							this.addContentItemPropertiesPane._contentClassNameTextBox .set("disabled", !entryTemplateSelected);
							this.addContentItemSecurityTitlePane.set( "disabled", !entryTemplateSelected);

							if (this.addContentItemPropertiesPane._contentClassTooltip) {
								this.addContentItemPropertiesPane._contentClassTooltip .set("label", "");
							}
							this.addContentItemPropertiesPane._contentClassNameTextBox .set("value", "");

							// Clear any error message.
							this._clearErrorMessage();

							if (!entryTemplateSelected) {
								this.addContentItemPropertiesPane .setContentClass(null);
								this.addContentItemPropertiesPane .clearRendering();
								this.addContentItemSecurityPane._contentClass = null;
								this.addContentItemSecurityPane._securityPane .reset();
								return;
							}

							if (this.repository._isP8()) {
								// Present messages if this entry template supports declaring records.
								var declareRecord = this._entryTemplate.declareRecord;
								if (declareRecord && (declareRecord != "") 	&& (declareRecord != ecm.model.EntryTemplate.DECLARE.NEVER_DECLARE)) {
									if (declareRecord == ecm.model.EntryTemplate.DECLARE.ALWAYS_DECLARE) {
										this .setMessage( this._messages.add_document_using_always_declare_template_warning, "warning");
									} else {
										this .setMessage( this._messages.add_document_using_optional_declare_template_info, "info");
									}
								}
							}

							// If there is no entry template list or only one entry template in the list, and this is not a folder
							// association entry template list, then show the entry template name text box instead of the entry
							// template selector.
							if ((!this._entryTemplates || this._entryTemplates.length == 1) && !this._entryTemplateIsFromFolder) {
								this.addContentItemGeneralPane .showEntryTemplateNameTextBox(this._entryTemplate);
							} else {
								// Create the entry template tooltip and  associate it with the entry template selector here
								// so as not to override the required tooltip message that is displayed when an entry template
								// has not been selected.
								this.addContentItemGeneralPane .createEntryTemplateSelectorTooltip(this._entryTemplate);
							}

							// Leave the folder location alone if this is for an existing item (checkin),
							// or if the entry template is associated with the current folder.
							if (this._entryTemplate) {
								if (!this._item && (!this._entryTemplateIsFromFolder || !this._entryTemplate.currentFolderAsParent)) {
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
										folderForTeamspace .retrieveTeamspace(lang.hitch( this, function( teamspace) {
																	this._teamspace = teamspace;
																	// if (teamspace && this.parentFolder && teamspace.id  == this.parentFolder.id)
																	// {
																	// this.parentFolder = null;
																	// }
																	this ._applyEntryTemplateFolderSelector();
																	this ._finishApplyEntryTemplate(renderProperties);
																}));
									} else {
										this._teamspace = null;
										this ._applyEntryTemplateFolderSelector();
										this ._finishApplyEntryTemplate(renderProperties);
									}
								} else {
									this ._finishApplyEntryTemplate(renderProperties);
								}
							}

						*/},
						onAcquire : function() {
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

						}, loadDocument : function(repository, items, callback,
								teamspace, resultSet, parameterMap) {
							var docInfo = this.item.id.split(",");
							this.oldDocumentId = docInfo[docInfo.length - 1].replace("{", "").replace("}", "");
							contentItemGeneralPane = this.addContentItemGeneralPane;
							this.workItemAttachmentItem = this.item;
							
							if (this.workItemAttachmentItem.parent) {
								this.workItem = this.workItemAttachmentItem.parent.parent;
								this.isWorkItem = this.workItem && this.workItem.isInstanceOf(ecm.model.WorkItem);
							} else if (resultSet && resultSet.parentFolder && resultSet.parentFolder.parent) {
								this.isWorkItem = resultSet.parentFolder.parent.isInstanceOf(ecm.model.WorkItem);

							}
							this.workItemWidget = parameterMap.widget;
							if (this.item) {
								this.objectStoreId = this.item.objectStoreId;
							}
							console.log("show check in1 ");
							this.showCheckin(repository, this.item, callback, teamspace);
							console.log("show check in2");
							// addContentItemDialog.set("title", Messages.add_document_scan_label);
//							contentItemGeneralPane.onContentSourceTypeChange();
							var myMimetype = this.item.mimetype;
							if (myMimetype == "image/jpeg" || myMimetype == "image/jpg" || myMimetype == "image/tiff"
									|| myMimetype == "image/png" || myMimetype == "application/pdf") {
								var strHostIP = window.location.hostname;
								var intPort = window.location.port;
								var desktop = ecm.model.desktop.id;
								var repositoryId = repository.id;
								var objectStoreName = this.item.getObjectStore().symbolicName;
								var docid = this.item.id;
								var filename = this.item.filename;
								var token = Request._security_token;
								var downloadURL = "/navigator/jaxrs/p8/getDocument?desktop=" + encodeURIComponent(desktop)
										+ "&repositoryId=" + encodeURIComponent(repositoryId)
										+ "&ObjectStoreName=" + encodeURIComponent(objectStoreName)
										+ "&docid=" + encodeURIComponent(docid) + "&security_token=" + encodeURIComponent(token)
										+ "&template_name=Document&transform=native&part_number=0&disposition=attachment&parm_part_filename="
										+ encodeURIComponent(filename);
								dom.byId("strHostIP").value = strHostIP;
								dom.byId("intPort").value = intPort;
								dom.byId("downloadURL").value = downloadURL;
								dom.byId("mType").value = myMimetype;
								console.log(myMimetype);
							}
							console .log("scanCheckin action started successfully");

						}
						/*						 ,applyEntryTemplate : function(renderProperties) {
							
								var entryTemplateSelected = this._entryTemplate ? true : false;
							// These fields are left alone by entry templates
							// associated with folders.
							if (!this._entryTemplateIsFromFolder) {
								this.addContentItemGeneralPane.folderSelector
										.set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._contentSourceType
										.set("disabled", !entryTemplateSelected);
								this.addContentItemGeneralPane._deleteLocalFile
										.set("disabled", !entryTemplateSelected);
								domAttr
										.set(
												this.addContentItemGeneralPane._fileInput,
												"disabled",
												!entryTemplateSelected);
								if (this.scanButton)
									this.scanButton.set("disabled",
											!entryTemplateSelected);
							} else {
								if (this._entryTemplate && this._entryTemplate.currentFolderAsParent) {
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

						}*/
						,generateThumb : function (newItem) {
							// var params1 = newItem.getPageImageUrl(1, -3, 0, false, 1.0, 1.0, 200, 200);
							console.log("newItem: "+newItem);
							var _thumbnailRequestItem;
							if (_thumbnailRequestItem == null || (this._thumbnailRequest != null && this._thumbnailRequest.getReadyState() == 4)) {
								_thumbnailRequestItem = newItem;
								this._nextThumbnailItem = null;
								var params = newItem.getPageImageRequestParameters(1, -3, 0, false, 1.0, 1.0, 200, 200);
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