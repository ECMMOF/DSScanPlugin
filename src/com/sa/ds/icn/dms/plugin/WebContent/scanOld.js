require(
		[ "dojo/_base/declare", "dojo/_base/lang", "ecm/model/Request",
				"ecm/widget/dialog/AddContentItemDialog", "dojo/on",
				"dojo/dom", "dojo/dom-style", "dojox/layout/ContentPane",
				"dojo/_base/json", "dojo/_base/sniff",
				"dojo/i18n! scan/nls/Messages", "dojo/dom-attr",
				"dojo/dom-class", "ecm/model/ContentItem",
				"ecm/widget/dialog/CheckInDialog",
				"ecm/widget/process/StepProcessorLayout" ],
		function(declare, lang, Request, AddContentItemDialog, on, dom,
				domStyle, ContentPane, dojojson, has, Messages, domAttr,
				domClass, ContentItem, CheckInDialog, StepProcessorLayout) {
			/**
			 * Use this function to add any global JavaScript methods your
			 * plug-in requires.
			 */
			var addContentItemDialog, contentItemGeneralPane, addContentItemPropertiesPane, addContentItemPropertiesPane, normalOnAdd, normal_updateUIForSourceType, normal_updateUIForSourceType, normalOnCancel, scanButton, scanPane, normalApplyEntryTemplate, checkInDialog, myItem, normalShowCheckin;

			lang.setObject("scanDocument", function(repository, items,
					callback, teamspace, resultSet, parameterMap) {
				console.log("scan action is starting");
				initScanActions(repository, items, callback, teamspace,
						resultSet, parameterMap);
				// addContentItemDialog.setIntroText();
				if (items != null && items[0].isFolder())
					addContentItemDialog.show(repository, items[0], true);
				else
					addContentItemDialog.show(repository, repository, true);
				addContentItemDialog.set("title",
						Messages.add_document_scan_label);
				contentItemGeneralPane.onContentSourceTypeChange();
				console.log("scan action started successfully");
			});

			lang
					.setObject(
							"scanCheckin",
							function(repository, items, callback, teamspace,
									resultSet, parameterMap) {
								console.log("scanCheckin action is starting");
								initScanCheckInAction(repository, items,
										callback, teamspace, resultSet,
										parameterMap);
								checkInDialog.showCheckin(repository, myItem, callback, teamspace);
								// addContentItemDialog.set("title",
								// Messages.add_document_scan_label);
								contentItemGeneralPane
										.onContentSourceTypeChange();
								var myMimetype = myItem.mimetype;
								if (myMimetype == "image/jpeg"
										|| myMimetype == "image/jpg"
										|| myMimetype == "image/tiff"
										|| myMimetype == "image/png"
										|| myMimetype == "application/pdf") {
									var strHostIP = window.location.hostname;
									var intPort = window.location.port;
									var desktop = ecm.model.desktop.id;
									var repositoryId = repository.id;
									var objectStoreName = myItem
											.getObjectStore().symbolicName;
									var docid = myItem.id;
									var filename = myItem.filename;
									var token = Request._security_token;
									var downloadURL = "/navigator/jaxrs/p8/getDocument?desktop="
											+ encodeURIComponent(desktop)
											+ "&repositoryId="
											+ encodeURIComponent(repositoryId)
											+ "&ObjectStoreName="
											+ encodeURIComponent(objectStoreName)
											+ "&docid="
											+ encodeURIComponent(docid)
											+ "&security_token="
											+ encodeURIComponent(token)
											+ "&template_name=Document&transform=native&part_number=0&disposition=attachment&parm_part_filename="
											+ encodeURIComponent(filename);
									dom.byId("strHostIP").value = strHostIP;
									dom.byId("intPort").value = intPort;
									dom.byId("downloadURL").value = downloadURL;
									dom.byId("mType").value = myMimetype;
								}
								console
										.log("scanCheckin action started successfully");
							});

			lang
					.setObject(
							"scanDocumentUsingTemplate",
							function(repository, items, callback, teamspace,
									resultSet, parameterMap) {
								console.log("scan using Template action is starting");
								initScanActions(repository, items, callback, teamspace, resultSet, parameterMap);
								addContentItemDialog.show(repository, null, true, false, null, null, true, null);
								addContentItemDialog .set("title", Messages.add_document_scan_entery_label);
								contentItemGeneralPane .onContentSourceTypeChange();
								scanButton.set("disabled", true);
								applyScanEntryTemplate(addContentItemDialog);
								console.log("scan  using Template action started successfully");
							});

			function initScanActions(repository, items, callback, teamspace,
					resultSet, parameterMap) {
				console.log("initScanActions action is starting");
				addContentItemDialog = new AddContentItemDialog();
				contentItemGeneralPane = addContentItemDialog.addContentItemGeneralPane;
				addContentItemPropertiesPane = addContentItemDialog.addContentItemPropertiesPane;
				normalApplyEntryTemplate = addContentItemDialog.applyEntryTemplate;
				normalOnAdd = addContentItemDialog.onAdd;
				normal_updateUIForSourceType = contentItemGeneralPane._updateUIForSourceType;
				normalOnCancel = addContentItemDialog.onCancel;
				scanButton = null;
				addContentItemDialog.onCancel = function() {
					contentItemGeneralPane.contentSourceTypeChoices
							.splice(0, 1);
					contentItemGeneralPane._updateUIForSourceType = normal_updateUIForSourceType;
					scanPane.setContent("");
					scanPane.destroyRecursive(true);
					addContentItemDialog.onCancel = normalOnCancel;
					addContentItemDialog.onCancel();
				};

				addContentItemDialog.onAcquire = function() {
					{
						var sourceCount = DWObject.SourceCount;
						if (sourceCount == 0)
							return;

						if (_last_selected_index === -1) {
							_last_selected_index = D_get(_divDWTSourceContainerID).selectedIndex;
						}

						var _obj = {};
						_obj.SelectSourceByIndex = _last_selected_index;
						_obj.IfShowUI = D_get("ShowUI").checked;

						for ( var i = 0; i < 3; i++) {
							if (document.getElementsByName("PixelType").item(i).checked === true) {
								_obj.PixelType = i;
								break;
							}
						}
						_obj.Resolution = D_get("Resolution").value;
						_obj.IfFeederEnabled = D_get("ADF").checked;
						_obj.IfDuplexEnabled = D_get("Duplex").checked;
						if (DynamLib.env.bWin)
							g_DWT_PrintMsg("Pixel Type: " + _obj.PixelType
									+ "<br />Resolution: " + _obj.Resolution);

						_obj.IfDisableSourceAfterAcquire = true;

						_iTwainType = 0;

						DWObject.AcquireImage(_obj);

					}
				};

				var scanOnAdd = function() {
					if (DWObject.HowManyImagesInBuffer == 0) {
						alert("There is no scanned page");
						return;
					} else {
						var strHostIP = window.location.hostname;
						var intPort = window.location.port;
						var desktop = ecm.model.desktop.id;
						var strActionPage = "/navigator/jaxrs/p8/addItem?desktop="
								+ desktop;
						var contentSourceType = "Document";
						DWObject.HttpFieldNameOfUploadedImage = "file";
						DWObject.HTTPPort = intPort;

						var properties = addContentItemDialog.addContentItemPropertiesPane
								.getPropertiesJSON();
						var childComponentValues = addContentItemDialog.addContentItemPropertiesPane
								.getChildComponentValues();
						var permissions = addContentItemDialog.addContentItemSecurityPane
								.getPermissions();
						var parentFolder = addContentItemDialog.parentFolder;
						var documentType = addContentItemDialog.addContentItemPropertiesPane
								.getDocumentType();
						var filename = addContentItemPropertiesPane
								.getPropertyValue(addContentItemPropertiesPane
										.getTitlePropertyName());

						var addAsMinorVersion = !addContentItemDialog.addContentItemGeneralPane
								.getAsMajorVersion();
						var compoundDocument = addContentItemDialog._entryTemplate
								&& addContentItemDialog._entryTemplate.enableCompoundDocuments
								&& addContentItemDialog._entryTemplate.enableCompoundDocuments.on ? true
								: false;
						var objectStore = null;
						if (addContentItemDialog.repository._isP8()) {
							objectStore = (parentFolder && parentFolder.objectStore);

							if (!objectStore
									&& addContentItemDialog._objectStore) {
								objectStore = addContentItemDialog._objectStore;
							}
						}
						var docId = (parentFolder && parentFolder.id) || "";
						var allowDuplicateFileNames = true;
						if (addContentItemDialog._entryTemplate) {
							allowDuplicateFileNames = addContentItemDialog._entryTemplate.allowDuplicateFileNames;
						}

						var setSecurityParent = (addContentItemDialog._teamspace && this.repository
								._isP8());
						if (!setSecurityParent
								&& addContentItemDialog._entryTemplate
								&& addContentItemDialog._entryTemplate.inheritSecurityFromParentFolder) {
							setSecurityParent = true;
						}
						if (setSecurityParent == null)
							setSecurityParent = false;
						DWObject.SetHTTPFormField("security_token",
								Request._security_token);
						DWObject.SetHTTPFormField("criterias", dojojson
								.toJson(properties));
						DWObject.SetHTTPFormField("childComponentValues",
								dojojson.toJson(childComponentValues));
						DWObject.SetHTTPFormField("acl", dojojson
								.toJson(permissions));
						DWObject.SetHTTPFormField("desktop", desktop);
						DWObject
								.SetHTTPFormField("repositoryId", repository.id);
						DWObject.SetHTTPFormField("docid", docId);
						DWObject.SetHTTPFormField("parm_content_source_type",
								contentSourceType);
						DWObject
								.SetHTTPFormField("template_name", documentType);
						DWObject.SetHTTPFormField("asMinorVersion",
								addAsMinorVersion);
						DWObject.SetHTTPFormField("compoundDocument",
								compoundDocument);
						DWObject.SetHTTPFormField("allowDuplicateFileNames",
								allowDuplicateFileNames);
						DWObject.SetHTTPFormField("set_security_parent",
								setSecurityParent);
						DWObject.SetHTTPFormField("objectStoreId",
								objectStore.id);
						var sFun = function() {
							return;
						}, fFun = function() {
							var responseText = DWObject.HTTPPostResponseString;
							var response = getResponse(responseText);
							var itemJSON = response.rows[0];

							var newItem = ecm.model.ContentItem.createFromJSON(
									itemJSON, repository, null, parentFolder);
							if (addContentItemDialog._entryTemplate
									&& addContentItemDialog._entryTemplate.workflow) {
								addContentItemDialog._startWorkflow(newItem);
							}
							contentItemGeneralPane.contentSourceTypeChoices .splice(0, 1);
							contentItemGeneralPane._updateUIForSourceType = normal_updateUIForSourceType;
							addContentItemDialog.applyEntryTemplate = normalApplyEntryTemplate;
							scanPane.setContent("");
							scanPane.destroyRecursive(true);
							addContentItemDialog.onCancel = normalOnCancel;
							addContentItemDialog.onCancel();

							if (addContentItemDialog.parentFolder) {
								if (addContentItemDialog._entryTemplate) {
									// If the entry template folder matches the
									// currently open desktop folder, refresh
									// the desktop folder to show the new
									// folder.
									if (addContentItemDialog._desktopFolder
											&& (addContentItemDialog._desktopFolder.id == addContentItemDialog.parentFolder.id)) {
										addContentItemDialog._desktopFolder
												.refresh();
									} else {
										// Do nothing, the entry template folder
										// is not the currently opened folder in
										// the desktop.
									}
								} else {
									addContentItemDialog.parentFolder.refresh();
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
						var uploadfilename = filename
								+ "."
								+ document.getElementsByName("ImageType").item(
										i).value;
						DWObject.SetHTTPFormField("parm_part_filename",
								uploadfilename);

						if (strImageType == 1)
							DWObject.SetHTTPFormField("mimetype", "image/jpeg");
						else if (strImageType == 2)
							DWObject.SetHTTPFormField("mimetype", "image/tiff");
						else if (strImageType == 3)
							DWObject.SetHTTPFormField("mimetype", "image/png");
						else
							DWObject.SetHTTPFormField("mimetype",
									"application/pdf");

						if (strImageType == 2 /*
												 * &&
												 * D_get("MultiPageTIFF_save").checked
												 */) {
							if ((DWObject.SelectedImagesCount == 1)
									|| (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
								DWObject
										.HTTPUploadAllThroughPostAsMultiPageTIFF(
												strHostIP, strActionPage,
												uploadfilename, sFun, fFun);
							} else {
								DWObject.HTTPUploadThroughPostAsMultiPageTIFF(
										strHostIP, strActionPage,
										uploadfilename, sFun, fFun);
							}
						} else if (strImageType == 4 /** && * D_get("MultiPagePDF_save").checked  */) {
							if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
								DWObject.HTTPUploadAllThroughPostAsPDF(strHostIP, strActionPage, uploadfilename, sFun, fFun);
							} else {
								DWObject.HTTPUploadThroughPostAsMultiPagePDF(strHostIP, strActionPage, uploadfilename, sFun, fFun);
							}
						} else {
							DWObject.HTTPUploadThroughPostEx(strHostIP, DWObject.CurrentImageIndexInBuffer, strActionPage, uploadfilename,
									strImageType, sFun, fFun);
						}
					}
					;
					console.log("initScanActions action finished");
				};

				scanPane = new ContentPane({
					content : Messages.scan_content,
					executeScripts : true,
					preventCache : true,
					refreshOnShow : true,
					postCreate : function() {

					}
				});
				scanPane.startup();

				if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
					contentItemGeneralPane.contentSourceTypeChoices.splice(0, 0, {
								value : "Scan",
								label : Messages.add_document_scan_label
							});
					contentItemGeneralPane._contentSourceType.value = "Scan";
				}

				contentItemGeneralPane._updateUIForSourceType = function(
						sourceType) {
					if (sourceType == "Item") {
						domStyle.set(this._fileInputArea, "display", "none");
						domStyle.set(this._externalURLDiv, "display", "none");
						domStyle.set(dom.byId("container"), "display", "none");
						addContentItemDialog.onAdd = normalOnAdd;
						addContentItemDialog._actionButton.set("disabled",
								!addContentItemDialog.isValid(false));
						scanButton.destroy();

					} else if (sourceType == "ExternalURL") {
						domStyle.set(this._fileInputArea, "display", "none");
						domStyle.set(this._externalURLDiv, "display", "");
						domStyle.set(dom.byId("container"), "display", "none");
						addContentItemDialog.onAdd = normalOnAdd;
						addContentItemDialog._actionButton.set("disabled",
								!addContentItemDialog.isValid(false));
						scanButton.destroy();

					} else if (sourceType == "Document") { // "Document"
						// file
						domStyle.set(this._fileInputArea, "display", "");
						domStyle.set(this._externalURLDiv, "display", "none");
						domStyle.set(dom.byId("container"), "display", "none");
						addContentItemDialog.onAdd = normalOnAdd;
						addContentItemDialog._actionButton.set("disabled",
								!addContentItemDialog.isValid(false));
						scanButton.destroy();

					} else { // Scan
						domStyle.set(this._fileInputArea, "display", "none");
						domStyle.set(this._externalURLDiv, "display", "none");
						domStyle.set(dom.byId("container"), "display", "");
						addContentItemDialog.onAdd = scanOnAdd;
						addContentItemDialog._actionButton.set("disabled", false);
						if (scanButton == null) {
							scanButton = addContentItemDialog.addButton(
									Messages.add_document_scan_button,
									"onAcquire", true, true, "ScanButton");
							scanButton.set("disabled", false);
						}
					}
					;
				};

				scanPane.placeAt(contentItemGeneralPane, "last");

			}

			function initScanCheckInAction(repository, items, callback,
					teamspace, resultSet, parameterMap) {
				console.log("initScanChecInAction  is starting");
				myItem = items[0];
				checkInDialog = new CheckInDialog();
				contentItemGeneralPane = checkInDialog.addContentItemGeneralPane;
				contentItemGeneralPane._addContentItemDialog = checkInDialog;
				addContentItemPropertiesPane = checkInDialog.addContentItemPropertiesPane;
				normalApplyEntryTemplate = checkInDialog.applyEntryTemplate;
				normalShowCheckin = checkInDialog.showCheckin;
				normalOnCheckin = checkInDialog.onCheckin;
				normal_updateUIForSourceType = contentItemGeneralPane._updateUIForSourceType;
				normalOnCancel = checkInDialog.onCancel;
				scanButton = null;

				checkInDialog.showCheckin = function(repository, item, callback, teamspace) {
					var entryTemplateId = item.entryTemplateId;
					if (entryTemplateId && (entryTemplateId.length > 0)) {
						var entryTemplate = repository .getEntryTemplateById(entryTemplateId);

						var checkInEntryTemplateRetrievedHandler = lang .hitch( checkInDialog, function(entryTemplate) {
											if (!entryTemplate.isRetrieved) {
												checkInDialog.setMessage(checkInDialog._messages.checkin_entry_template_not_retrieved_warning,"warning");
												checkInDialog.show(repository, item, callback, teamspace, null);
											} else if (entryTemplate.useForCheckin) {
												// Check to see if the entry
												// template identifies
												// a workflow.
												applyScanEntryTemplate(checkInDialog);
												var workflow = entryTemplate.workflow;
												if (workflow && repository._isP8()) { // isWorkflowRunning()
													// is only  supported  for  P8 If the workflow is  currently running, turn off options in the
													// Checkin dialog.
													workflow.isWorkflowRunning(item,lang.hitch(checkInDialog,
																					function(isWorkflowRunning) {
																						checkInDialog._isWorkflowRunning = isWorkflowRunning;
																						checkInDialog
																								.show(
																										repository,
																										item,
																										callback,
																										teamspace,
																										entryTemplate);
																					}));
												} else {
													// Treat checkin for other
													// repository types
													// as having a running
													// workflow so that
													// workflow options are
													// turned off.
													checkInDialog._isWorkflowRunning = true;

													checkInDialog.show(
															repository, item,
															callback,
															teamspace,
															entryTemplate);
												}
											} else {
												checkInDialog.show(repository, item, callback, teamspace, null);
											}
										});

						if (!entryTemplate.isRetrieved) {
							entryTemplate.retrieveEntryTemplate( checkInEntryTemplateRetrievedHandler, false, true);
						} else {

							checkInEntryTemplateRetrievedHandler(entryTemplate);
						}
					} else {
						checkInDialog.show(repository, item, callback,
								teamspace, null);
					}
				};

				checkInDialog.onCancel = function() {
					contentItemGeneralPane.contentSourceTypeChoices
							.splice(0, 1);
					contentItemGeneralPane._updateUIForSourceType = normal_updateUIForSourceType;
					checkInDialog.applyEntryTemplate = normalApplyEntryTemplate;
					checkInDialog.showCheckin = normalShowCheckin;
					scanPane.setContent("");
					scanPane.destroyRecursive(true);
					checkInDialog.onCancel = normalOnCancel;
					checkInDialog.onCancel();
				};

				checkInDialog.onAcquire = function() {
					{
						var sourceCount = DWObject.SourceCount;
						if (sourceCount == 0)
							return;

						if (_last_selected_index === -1) {
							_last_selected_index = D_get(_divDWTSourceContainerID).selectedIndex;
						}

						var _obj = {};
						_obj.SelectSourceByIndex = _last_selected_index;
						_obj.IfShowUI = D_get("ShowUI").checked;

						for ( var i = 0; i < 3; i++) {
							if (document.getElementsByName("PixelType").item(i).checked === true) {
								_obj.PixelType = i;
								break;
							}
						}
						_obj.Resolution = D_get("Resolution").value;
						_obj.IfFeederEnabled = D_get("ADF").checked;
						_obj.IfDuplexEnabled = D_get("Duplex").checked;
						if (DynamLib.env.bWin)
							g_DWT_PrintMsg("Pixel Type: " + _obj.PixelType
									+ "<br />Resolution: " + _obj.Resolution);

						_obj.IfDisableSourceAfterAcquire = true;

						_iTwainType = 0;

						DWObject.AcquireImage(_obj);

					}
				};

				var scanOnCheckin = function() {
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
						var properties = checkInDialog.addContentItemPropertiesPane .getPropertiesJSON();
						var childComponentValues = checkInDialog.addContentItemPropertiesPane .getChildComponentValues();
						var permissions = checkInDialog.addContentItemSecurityPane .getPermissions();
						var parentFolder = checkInDialog.parentFolder;
						var documentType = checkInDialog.addContentItemPropertiesPane.getDocumentType();
						var filename = addContentItemPropertiesPane .getPropertyValue(addContentItemPropertiesPane .getTitlePropertyName());
						var addAsMinorVersion = !checkInDialog.addContentItemGeneralPane .getAsMajorVersion();
						var autoClassify = checkInDialog.addContentItemGeneralPane .getAutoClassify();
						var objectStore = null;
						if (checkInDialog.repository._isP8()) {
							objectStore = (parentFolder && parentFolder.objectStore);
							if (!objectStore && checkInDialog._objectStore) {
								objectStore = checkInDialog._objectStore;
							}
						}
						var docId = myItem.id;
						DWObject.SetHTTPFormField("security_token", Request._security_token);
						DWObject.SetHTTPFormField("criterias", dojojson .toJson(properties));
						DWObject.SetHTTPFormField("childComponentValues", dojojson.toJson(childComponentValues));
						DWObject.SetHTTPFormField("acl", dojojson .toJson(permissions));
						DWObject.SetHTTPFormField("desktop", desktop);
						DWObject .SetHTTPFormField("repositoryId", repository.id);
						DWObject.SetHTTPFormField("docid", docId);
						DWObject.SetHTTPFormField("parm_content_source_type", contentSourceType);
						DWObject .SetHTTPFormField("template_name", documentType);
						DWObject.SetHTTPFormField("asMinorVersion", addAsMinorVersion);
						DWObject.SetHTTPFormField("autoClassify", autoClassify);
						DWObject.SetHTTPFormField("objectStoreId", objectStore.id);
						var sFun = function() {
							return;
						}, fFun = function() {
							if (checkInDialog._entryTemplate && checkInDialog._entryTemplate.workflow) {
								var responseText = DWObject.HTTPPostResponseString;
								var response = getResponse(responseText);
								var itemJSON = response.rows[0];
								var updatedItem = ecm.model.ContentItem .createFromJSON(itemJSON, repository, null, null);
								checkInDialog._startWorkflow(updatedItem);
							}
							contentItemGeneralPane.contentSourceTypeChoices.splice(0, 1);
							contentItemGeneralPane._updateUIForSourceType = normal_updateUIForSourceType;
							checkInDialog.applyEntryTemplate = normalApplyEntryTemplate;
							checkInDialog.showCheckin = normalShowCheckin;
							scanPane.setContent("");
							scanPane.destroyRecursive(true);
							checkInDialog.onCancel = normalOnCancel;
							checkInDialog.onCancel();

							if (checkInDialog.parentFolder) {
								if (checkInDialog._entryTemplate) {
									// If the entry template folder matches the
									// currently open desktop folder, refresh
									// the desktop folder to show the new
									// folder.
									if (checkInDialog._desktopFolder && (checkInDialog._desktopFolder.id == checkInDialog.parentFolder.id)) {
										checkInDialog._desktopFolder.refresh();
									} else {
										// Do nothing, the entry template folder
										// is not the currently opened folder in
										// the desktop.
									}
								} else {
									checkInDialog.parentFolder.refresh();
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
						var uploadfilename = filename + "." + document.getElementsByName("ImageType").item(i).value;
						DWObject.SetHTTPFormField("parm_part_filename", uploadfilename);

						if (strImageType == 1)
							DWObject.SetHTTPFormField("mimetype", "image/jpeg");
						else if (strImageType == 2)
							DWObject.SetHTTPFormField("mimetype", "image/tiff");
						else if (strImageType == 3)
							DWObject.SetHTTPFormField("mimetype", "image/png");
						else
							DWObject.SetHTTPFormField("mimetype",
									"application/pdf");

						if (strImageType == 2  ) {
							if ((DWObject.SelectedImagesCount == 1)
									|| (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
								DWObject .HTTPUploadAllThroughPostAsMultiPageTIFF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
							} else {
								DWObject.HTTPUploadThroughPostAsMultiPageTIFF( strHostIP, strActionPage, 	uploadfilename, sFun, fFun);
							}
						} else if (strImageType == 4  ) {
							if ((DWObject.SelectedImagesCount == 1) || (DWObject.SelectedImagesCount == DWObject.HowManyImagesInBuffer)) {
								DWObject.HTTPUploadAllThroughPostAsPDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
							} else {
								DWObject.HTTPUploadThroughPostAsMultiPagePDF( strHostIP, strActionPage, uploadfilename, sFun, fFun);
							}
						} else {
							DWObject.HTTPUploadThroughPostEx(strHostIP, DWObject.CurrentImageIndexInBuffer, strActionPage, uploadfilename, strImageType, sFun, fFun);
						}
					}
					;
					console.log("initScanActions action finished");
				};

				scanPane = new ContentPane({
					content : Messages.scan_content,
					executeScripts : true,
					preventCache : true,
					refreshOnShow : true,
					postCreate : function() {

					}
				});
				scanPane.startup();

				if (contentItemGeneralPane.contentSourceTypeChoices[0].value != "Scan") {
					contentItemGeneralPane.contentSourceTypeChoices.splice(0,
							0, {
								value : "Scan",
								label : Messages.add_document_scan_label
							});
					contentItemGeneralPane._contentSourceType.value = "Scan";
				}

				contentItemGeneralPane._updateUIForSourceType = function(
						sourceType) {
					if (sourceType == "Item") {
						domStyle.set(contentItemGeneralPane._fileInputArea,
								"display", "none");
						domStyle.set(contentItemGeneralPane._externalURLDiv,
								"display", "none");
						domStyle.set(dom.byId("container"), "display", "none");
						checkInDialog.onCheckin = normalOnCheckin;
						checkInDialog._actionButton.set("disabled",!checkInDialog.isValid(false));
						if (scanButton != null)
							scanButton.destroy();
						scanButton = null;

					} else if (sourceType == "ExternalURL") {
						domStyle.set(contentItemGeneralPane._fileInputArea,
								"display", "none");
						domStyle.set(contentItemGeneralPane._externalURLDiv,
								"display", "");
						domStyle.set(dom.byId("container"), "display", "none");
						checkInDialog.onCheckin = normalOnCheckin;
						checkInDialog._actionButton.set("disabled",
								!checkInDialog.isValid(false));
						if (scanButton != null)
							scanButton.destroy();
						scanButton = null;

					} else if (sourceType == "Document") { // "Document"
						// file
						domStyle.set(contentItemGeneralPane._fileInputArea,
								"display", "");
						domStyle.set(contentItemGeneralPane._externalURLDiv,
								"display", "none");
						domStyle.set(dom.byId("container"), "display", "none");
						checkInDialog.onCheckin = normalOnCheckin;
						checkInDialog._actionButton.set("disabled",
								!checkInDialog.isValid(false));
						if (scanButton != null)
							scanButton.destroy();
						scanButton = null;
					} else { // Scan
						domStyle.set(contentItemGeneralPane._fileInputArea,
								"display", "none");
						domStyle.set(contentItemGeneralPane._externalURLDiv,
								"display", "none");
						domStyle.set(dom.byId("container"), "display", "");
						checkInDialog.onCheckin = scanOnCheckin;
						checkInDialog._actionButton.set("disabled", false);
						if (scanButton == null) {
							scanButton = checkInDialog.addButton(
									Messages.add_document_scan_button,
									"onAcquire", true, true, "ScanButton");
							scanButton.set("disabled", false);
						}
					}
					;
				};
				scanPane.placeAt(contentItemGeneralPane, "last");

			}

			function getResponse(responseText) {
				var response = null;
				if (responseText
						&& responseText.length > 0
						&& (responseText.substring(0, 1) == "{" || responseText
								.substring(0, 1) == "[")) {
					/**
					 * Added this try block to catch the uncaught error:
					 * "JSON.parse" errors when it receives a malformed JSON
					 * string in an argument. In order for the catch clause to
					 * be tripped, a response must be received, containing an
					 * invalid JSON text. Although JSON.parse throws an error
					 * readily, dojojson.fromJson does not. So, we force it to
					 * do so.
					 */
					try {
						if (has("ff") || has("ie")) {
							if (responseText.length > 4
									&& responseText.substring(0, 4) == "{}&&") {
								responseText = responseText.substring(4);
								// remove prefix for preventing JavaScript
								// hijacking
							}
							// IE 9 and IE 10 do not have JSON.
							var useJSONParse = false;
							try {
								if (JSON && JSON.parse) {
									useJSONParse = true;
								}
							} catch (e) {
								// ignore error
							}
							if (useJSONParse) {
								response = JSON.parse(responseText);
							} else {
								response = dojojson.fromJson(responseText);
							}
						} else {
							response = dojojson.fromJson(responseText);
							if (response["object_with_error"]) {
								response = null;
							}
						}
					} catch (e) {
						response = null;
						this
								.logError("getResponse", "Error parsing JSON: "
										+ e);
						if (e.description) {
							this.logError("getResponse",
									"Error description parsing JSON: "
											+ e.description);
						}
					}
				}
				return response;
			}

			function applyScanEntryTemplate(dialog) {
				/**
				 * Updates the add dialog using the currently selected entry
				 * template settings.
				 */
				dialog.applyEntryTemplate = function() {
					var entryTemplateSelected = dialog._entryTemplate ? true
							: false;
					// These fields are left alone by entry
					// templates associated with folders.
					if (!dialog._entryTemplateIsFromFolder) {
						dialog.addContentItemGeneralPane.folderSelector.set(
								"disabled", !entryTemplateSelected);
						dialog.addContentItemGeneralPane._contentSourceType
								.set("disabled", !entryTemplateSelected);
						dialog.addContentItemGeneralPane._deleteLocalFile.set(
								"disabled", !entryTemplateSelected);
						// domAttr.set(scanButton, "disabled",
						// !entryTemplateSelected);
						scanButton.set("disabled", !entryTemplateSelected);
					} else {
						if (dialog._entryTemplate
								&& dialog._entryTemplate.currentFolderAsParent) {
							dialog.parentFolder = dialog._originalFolder;
						}
					}
					if (dialog.repository._isP8()) {
						dialog.addContentItemGeneralPane._majorVersion.set(
								"disabled", !entryTemplateSelected);
						var color = "";
						if (entryTemplateSelected) {

							domClass
									.remove(
											dialog.addContentItemGeneralPane._majorVersionLabel,
											"labelReadOnly");
							/*
							 * domStyle.set(dialog.addContentItemGeneralPane._majorVersionLabel,
							 * "color", color);
							 */
						} else {
							/*
							 * color = domStyle
							 * .get(dialog.addContentItemGeneralPane._majorVersionLabel,
							 * "color"); domStyle
							 * .set(dialog.addContentItemGeneralPane._majorVersionLabel,
							 * "color", "gray");
							 */
							domClass
									.add(
											dialog.addContentItemGeneralPane._majorVersionLabel,
											"labelReadOnly");
						}
					}

					if (dialog._entryTemplate) {
						if (dialog.repository._isP8()
								|| dialog.repository._isCM()) {
							var workflow = dialog._entryTemplate.workflow;
							if (workflow) {
								if (workflow.promptToLaunchWorkflow
										&& !dialog._isWorkflowRunning) {
									domStyle
											.set(
													dialog.addContentItemGeneralPane._majorVersionStartWorkflowDiv,
													"display", "");
									dialog
											._displayEntryTemplatePromptLaunchWorkflow(
													"", false);
									dialog.addContentItemGeneralPane
											.setStartOnWorkflow(true);
								} else {
									dialog
											._displayEntryTemplatePromptLaunchWorkflow(
													"none", true);
								}
							} else {
								dialog
										._displayEntryTemplatePromptLaunchWorkflow(
												"none", true);
							}
						}

						if (dialog._entryTemplate.type != "FOLDER") {
							if (dialog._entryTemplate.allowUserSelectSaveChoice
									&& !dialog.addContentItemGeneralPane
											.hasExternalFiles()) {
								domStyle
										.set(
												dialog.addContentItemGeneralPane._contentSourceTypeDiv,
												"display", "");
							} else {
								domStyle
										.set(
												dialog.addContentItemGeneralPane._contentSourceTypeDiv,
												"display", "none");
							}
							var choices = [];
							if (dialog._entryTemplate.allowSaveLocalDocument) {
								choices.push("Scan");
								choices.push("Document");

							}
							if (dialog._entryTemplate.allowSavePropertiesOnly) {
								choices.push("Item");
							}
							if (dialog.repository._isP8()) {
								if (dialog._entryTemplate.allowSaveExternalDocumentLink) {
									choices.push("ExternalURL");
								}
							}
							dialog.addContentItemGeneralPane.addContentSourceTypeChoices(choices);
						}
					}

					dialog.addContentItemPropertiesTitlePane.set("disabled",
							!entryTemplateSelected);
					dialog.addContentItemPropertiesPane._contentClassNameTextBox
							.set("disabled", !entryTemplateSelected);
					dialog.addContentItemSecurityTitlePane.set("disabled",
							!entryTemplateSelected);

					if (dialog.addContentItemPropertiesPane._contentClassTooltip) {
						dialog.addContentItemPropertiesPane._contentClassTooltip
								.set("label", "");
					}
					dialog.addContentItemPropertiesPane._contentClassNameTextBox
							.set("value", "");

					// Clear any error message.
					dialog._clearErrorMessage();

					if (!entryTemplateSelected) {
						dialog.addContentItemPropertiesPane
								.setContentClass(null);
						dialog.addContentItemPropertiesPane.clearRendering();
						dialog.addContentItemSecurityPane._contentClass = null;
						dialog.addContentItemSecurityPane._securityPane.reset();
						return;
					}

					if (dialog.repository._isP8()) {
						// Present messages if this entry
						// template supports declaring records.
						var declareRecord = dialog._entryTemplate.declareRecord;
						if (declareRecord
								&& (declareRecord != "")
								&& (declareRecord != ecm.model.EntryTemplate.DECLARE.NEVER_DECLARE)) {
							if (declareRecord == ecm.model.EntryTemplate.DECLARE.ALWAYS_DECLARE) {
								dialog
										.setMessage(
												dialog._messages.add_document_using_always_declare_template_warning,
												"warning");
							} else {
								dialog
										.setMessage(
												dialog._messages.add_document_using_optional_declare_template_info,
												"info");
							}
						}
					}

					// If there is no entry template list or
					// only one entry template in the list, and
					// this is not a folder
					// association entry template list, then
					// show the entry template name text box
					// instead of the entry
					// template selector.
					if ((!dialog._entryTemplates || dialog._entryTemplates.length == 1)
							&& !dialog._entryTemplateIsFromFolder) {
						dialog.addContentItemGeneralPane
								.showEntryTemplateNameTextBox(dialog._entryTemplate);
					} else {
						// Create the entry template tooltip and
						// associate it with the entry template
						// selector here
						// so as not to override the required
						// tooltip message that is displayed
						// when an entry template
						// has not been selected.
						dialog.addContentItemGeneralPane
								.createEntryTemplateSelectorTooltip(dialog._entryTemplate);
					}

					// Leave the folder location alone if this
					// is for an existing item (checkin),
					// or if the entry template is associated
					// with the current folder.
					if (dialog._entryTemplate) {
						if (!dialog._item
								&& (!dialog._entryTemplateIsFromFolder || !dialog._entryTemplate.currentFolderAsParent)) {
							dialog.parentFolder = dialog._entryTemplate.folder;
							if (dialog.repository._isP8()) {
								dialog._objectStore = dialog._entryTemplate.objectStore;
								if (dialog._entryTemplate.targetRepository) {
									dialog.repository = dialog._entryTemplate.targetRepository;
								}
							}
							var folderForTeamspace = dialog.parentFolder;
							if (folderForTeamspace == null) {
								folderForTeamspace = dialog._originalFolder;
							}
							var checkForTeamspace = folderForTeamspace
									&& folderForTeamspace.repository
									&& folderForTeamspace.repository.teamspacesEnabled;
							if (checkForTeamspace) {
								dialog.addContentItemGeneralPane.folderSelector.preventSelectRoot = false;
								folderForTeamspace
										.retrieveTeamspace(lang
												.hitch(
														dialog,
														function(teamspace) {
															dialog._teamspace = teamspace;
															// if (teamspace &&
															// this.parentFolder
															// &&
															// teamspace.id ==
															// this.parentFolder.id)
															// {
															// this.parentFolder
															// = null;
															// }
															dialog
																	._applyEntryTemplateFolderSelector();
															dialog
																	._finishApplyEntryTemplate();
														}));
							} else {
								dialog._teamspace = null;
								dialog._applyEntryTemplateFolderSelector();
								dialog._finishApplyEntryTemplate();
							}
						} else {
							dialog._finishApplyEntryTemplate();
						}
					}
				};
			}
		});
