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
				"dijit/_TemplatedMixin",
				"dijit/_WidgetsInTemplateMixin",
				"ecm/widget/dialog/AddContentItemDialog",
				"ecm/model/AttachmentItem","dojo/json",
				"dojo/_base/json",
				"ecm/model/Desktop",
				"dojo/dom-attr",
				"./CommonScan"
				],
		function(declare, aspect, dom, domStyle, domClass, domAttr, lang,registry,on,
				Request,_TemplatedMixin, _WidgetsInTemplateMixin,
				AddContentItemDialog,AttachmentItem, JSON, dojojson,Desktop,domAttr, CommonScan) {
			return declare(
					"scanPluginDojo.scan.AddContentItemCustomDialog",
					[ AddContentItemDialog ],
					{
						workItemAttachmentItem : null,
						workItem : null,
						resultSet:null,
						workItemResultSet : null,
						workItemWidget : null,
						parameterMap:null,
						postCreate : function() {
							this.inherited(arguments);
							var contentItemGeneralPane = this.addContentItemGeneralPane;
							// Override onFileInputChange To check For PDF
							contentItemGeneralPane.onFileInputChange=lang.hitch(this, function(){
								var numFiles;
								if (!contentItemGeneralPane._useFileTracker) {
									numFiles = (contentItemGeneralPane._fileInput && contentItemGeneralPane._fileInput.files && contentItemGeneralPane._fileInput.files.length) || 0;
								} else {
									numFiles = (contentItemGeneralPane._filesToUpload && contentItemGeneralPane._filesToUpload.length) || 0;
								}
								if (ecm.model.desktop) {
									var maxNumDocs = ecm.model.desktop.maxNumberDocToAdd;
									if (numFiles > maxNumDocs) {
										ecm.model.desktop.addMessage(Message.createErrorMessage("add_document_too_many_items_error", [
											maxNumDocs,
											numFiles
										]));
										contentItemGeneralPane._resetFileInput();
										numFiles = 0;
									}
								}
								if (contentItemGeneralPane._addContentItemDialog.repository._isOnDemand() && contentItemGeneralPane._fileInput.files[0].size == 0) {
									var message = Message.createErrorMessage("add_document_filesize_empty_od_error");
									if (message) {
										ecm.model.desktop.addMessage(message);
									}
									contentItemGeneralPane._resetFileInput();
									numFiles = 0;
								}
								var hadMultipleDocuments = contentItemGeneralPane._hasMultipleDocuments;
								contentItemGeneralPane._hasMultipleDocuments = (numFiles > 1);

								// Update the dialog title & intro text if the "hasMultipleDocuments" status has changed. 
								if (hadMultipleDocuments != contentItemGeneralPane._hasMultipleDocuments) {
									if (contentItemGeneralPane._hasMultipleDocuments) {
										if (contentItemGeneralPane._addContentItemDialog._useTemplate) {
											contentItemGeneralPane._addContentItemDialog.set("title", contentItemGeneralPane._messages.add_documents_using_template_dialog_title);
											contentItemGeneralPane._addContentItemDialog.setIntroTextRef(contentItemGeneralPane._messages.learn_more, (ecm.model.desktop.getHelpUrl(contentItemGeneralPane) || "") + "euche013.htm");
										} else {
											contentItemGeneralPane._addContentItemDialog.set("title", contentItemGeneralPane._messages.add_documents_dialog_title);
										}
										contentItemGeneralPane._addContentItemDialog.setIntroText(contentItemGeneralPane._messages.add_documents_context_info);
										if (!contentItemGeneralPane._useFileTracker) {
											domStyle.set(contentItemGeneralPane._contentSourceTypeDiv, "display", "none");
										}
									} else {
										if (contentItemGeneralPane._addContentItemDialog._useTemplate) {
											contentItemGeneralPane._addContentItemDialog.set("title", contentItemGeneralPane._messages.add_document_using_template_dialog_title);
											contentItemGeneralPane._addContentItemDialog.setIntroText(contentItemGeneralPane._messages.add_document_using_template_context_info);
											contentItemGeneralPane._addContentItemDialog.setIntroTextRef(contentItemGeneralPane._messages.learn_more, (ecm.model.desktop.getHelpUrl(true) || "") + "euche013.htm");
										} else {
											contentItemGeneralPane._addContentItemDialog.set("title", contentItemGeneralPane._messages.add_document_dialog_title);
											contentItemGeneralPane._addContentItemDialog.setIntroText(contentItemGeneralPane._messages.add_document_context_info);
										}
										domStyle.set(contentItemGeneralPane._contentSourceTypeDiv, "display", "");
									}
								}
								
								if (contentItemGeneralPane._useFileTracker)
									contentItemGeneralPane._updateDeleteLocalFileState();
								
								
								// Force To Check Only PDF
								/*if(numFiles > 0 && contentItemGeneralPane._fileInput.files[0].type != 'application/pdf'){
									
									var errorDialog = new ecm.widget.dialog.ErrorDialog();
									
									errorDialog.setMessage("لابد من إختيار ملف من نوع PDF",'error');
									errorDialog.setTitle("خطأ فى إختيار نوع الملف");
									errorDialog.setSize(400, 280);
									errorDialog.show();
									
									contentItemGeneralPane._resetFileInput();
									numFiles = 0;
								}*/
								
							});
							
						},
						
						initAndShowDialog: function(repository, items, callback, teamspace, resultSet, parameterMap){
							this.resultSet=resultSet;
							this.parameterMap=parameterMap;
							
							if (this.items != null	&& (this.items[0]).isInstanceOf(ecm.model.AttachmentItem)) {
								
								this.workItemAttachmentItem = this.items[0];
								this.workItem = this.items[0].parent;

								this.show(repository,items[0], true, false, callback,teamspace, false, null);
								
							}else if(this.resultSet.parentFolder != null	&& (this.resultSet.parentFolder).isInstanceOf(ecm.model.AttachmentItem)){

								this.workItemAttachmentItem = this.resultSet.parentFolder;
								this.workItem = this.resultSet.parentFolder.parent;
								
								this.show(repository,resultSet.parentFolder, true, false, callback,teamspace, false, null);
								
							}
						
							
							var workItemAttributes = this.workItem.attributes;
							var correspondenceNo= workItemAttributes.SequenceNumber;
							var hijricYear= workItemAttributes.HijricYear;
							var itemType= workItemAttributes.ItemType;
							
					
	                    			
                             aspect.after(this.addContentItemPropertiesPane, "onCompleteRendering", lang.hitch(this, function() {
								
								//domStyle.set(this.addContentItemGeneralPane._contentSourceTypeDiv,"pointer-events", "none");
								//domStyle.set(this.addContentItemGeneralPane._documentOnlyArea,"pointer-events", "none");
                            	 
                            
                            	 
                            	domStyle.set(this.addContentItemGeneralPane._contentSourceTypeDiv,"display", "none");
 								domStyle.set(this.addContentItemGeneralPane._documentOnlyArea,"display", "none");
 								
								
								this.addContentItemPropertiesPane._contentClassSelector.setDisabled(true);
								this.addContentItemPropertiesPane.setPropertyValue(this.addContentItemPropertiesPane.getTitlePropertyName(),this.workItem.attributes.F_Subject);
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceIds" ,correspondenceNo+","+hijricYear+","+itemType+";");
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceNumber" ,correspondenceNo);
								this.addContentItemPropertiesPane.setPropertyValue( "HijricYear" ,hijricYear);
								this.addContentItemPropertiesPane.setPropertyValue( "CorrespondenceType" ,itemType);
								this.addContentItemGeneralPane._majorVersion.setDisabled(true);
								if(this.addContentItemPropertiesPane._contentClassSelector.filterTemplateName!="RegulatoryDocuments"){
									this.addContentItemPropertiesPane._contentClassSelector.setSelected("RegulatoryDocuments");
									
								}
								this.addContentItemPropertiesPane._contentClassSelector.domNode.style.display = "none";
								
								
								CommonScan.hideAdminsFromSecurity(this.addContentItemSecurityPane);
								
								 
								
								
							}));
                             
                     		aspect.after(ecm.widget.dialog.AddPermissionDialog.prototype,"_onAdd",lang.hitch(this, function() {
                     			
                     			CommonScan.hideAdminsFromSecurity(this.addContentItemSecurityPane);
                     	
  							}));
                             
                             


							
							
						},_addDocumentItemCallback: function(newItem, fieldErrors) {
							this.inherited(arguments);
							this.itemsRetrieved(newItem);
						},
						itemsRetrieved : function(newItem) {

							this.workItemResultSet = this.resultSet;
							this.workItemWidget = this.parameterMap.widget;

							var cl = this.workItemWidget;
							var contentListResultSet = cl.getResultSet();
							var attachment = this.workItemResultSet.parentFolder;
							var attachmentName = attachment.authoredName;
							var attachmentItems = this.workItem.getValue(attachmentName);

							var type = 3;
							attachment.addAttachment(attachmentItems, newItem,this.repository, "", newItem["vsId"], type);
							
							attachment.retrieveAttachmentContents(true,true,lang.hitch(function(resultSet) {

														var modified = attachment.modified;
														if (!modified) {
															cl.setResultSet(resultSet);
														} else {
															var refreshedItems = resultSet.getItems();
															for (var i = 0; i < refreshedItems.length; i++) {
																for (var j = 0; j < contentListResultSet.length; j++) {
																	if (refreshedItems[i].id == contentListResultSet[j].id) {
																		contentListResultSet[j] = refreshedItems[i];
																		break;
																	}
																}
															}
															cl.setResultSet(contentListResultSet);
															attachment.resultSet = contentListResultSet;
														}
													}));
							this.hide();
						},
				

						
					});
			});