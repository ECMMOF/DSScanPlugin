define(
		[ "dojo/_base/declare", "dojo/_base/lang",
			"dojo/i18n!scanPluginDojo/scan/scanResources/nls/Messages",
		  "dojo/on", "dojo/dom",
				"dijit/registry", "dojo/request/script", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin",
				"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
				"dojo/text!./templates/scanTemplate.html" ],

		function(declare, lang,Messages, on, dom, registry, script, _WidgetBase,
				_OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin,
				template) {
			return declare(
					[ _WidgetBase, _OnDijitClickMixin, _TemplatedMixin,
							_WidgetsInTemplateMixin ],
					{
						templateString : template,
						Messages:Messages,
						constructor : function() {

//							script.get("plugin/DMSScanPlugin/getResource/scanPluginDojo/scan/scanResources/DWT/ALL_JS.js");
						},

						postMixInProperties : function() {

						},initLabels: function() {

							var modify_image = dom.byId("modify_image");
							if (modify_image)
								modify_image.innerHTML = Messages.modify_image;
							var no_twain_scanner = dom.byId("no_twain_scanner");
							if (no_twain_scanner)
								no_twain_scanner.innerHTML = Messages.no_twain_scanner;
							var no_scanner_driver = dom.byId("no_scanner_driver");
							if (no_scanner_driver)
								no_scanner_driver.innerHTML = Messages.no_scanner_driver;
							var you_can = dom.byId("you_can");
							if (you_can)
								you_can.innerHTML = Messages.you_can;
							var scanner_setting = dom.byId("scanner_setting");
							if (scanner_setting)
								scanner_setting.innerHTML = Messages.scanner_setting;
							var select_source = dom.byId("select_source");
							if (select_source)
								select_source.innerHTML = Messages.select_source;
							var new_height = dom.byId("new_height");
							if (new_height)
								new_height.innerHTML = Messages.new_height;
							var new_width = dom.byId("new_width");
							if (new_width)
								new_width.innerHTML = Messages.new_width;
							var interpolation_method = dom.byId("interpolation_method");
							if (interpolation_method)
								interpolation_method.innerHTML = Messages.interpolation_method;

							var btnCropOK = registry.byId("btnCropOK");
							if (btnCropOK)
								btnCropOK.set("label", Messages.ok);

							var btnCropCancel = registry.byId("btnCropCancel");
							if (btnCropCancel)
								btnCropCancel.set("label", Messages.cancel);

							var btnChangeImageSizeOK = registry.byId("btnChangeImageSizeOK");
							if (btnChangeImageSizeOK)
								btnChangeImageSizeOK.set("label", Messages.ok);

							var btnCancelChange = registry.byId("btnCancelChange");
							if (btnCancelChange)
								btnCancelChange.set("label", Messages.cancel);

							var DW_btnRemoveAllImages = registry .byId("DW_btnRemoveAllImages");
							if (DW_btnRemoveAllImages)
								DW_btnRemoveAllImages.set("label", Messages.remove_all_images);

							var DW_btnRemoveCurrentImage = registry.byId("DW_btnRemoveCurrentImage");
							if (DW_btnRemoveCurrentImage)
								DW_btnRemoveCurrentImage.set("label", Messages.remove_selected_images);

							var preview_mode = dom.byId("preview_mode");
							if (preview_mode)
								preview_mode.value = Messages.preview_mode;

							dom.byId("lblShowUI").innerHTML = Messages.ShowUI;
							dom.byId("ADFlbl").innerHTML = Messages.ADF;
							dom.byId("DuplexLbl").innerHTML = Messages.Duplex;
							dom.byId("Pixel_Type").innerHTML = Messages.Pixel_Type;
							dom.byId("BWlbl").innerHTML = Messages.BW;
							dom.byId("Graylbl").innerHTML = Messages.Gray;
							dom.byId("RGBlbl").innerHTML = Messages.RGB;
							dom.byId("Resolutionlbl").innerHTML = Messages.Resolution;
							
							
							

							var DWTcontroler = dom.byId("DWTcontroler");

							if (DWTcontroler)
								DWTcontroler.dir = Messages.dir;

						},

						// postCreate() is called after buildRendering(). This
						// is useful
						// to
						// override when
						// you need to access and/or manipulate DOM nodes
						// included with
						// your
						// widget.
						// DOM nodes and widgets with the dojoAttachPoint
						// attribute
						// specified
						// can now be directly
						// accessed as fields on "this".
						// Common operations for postCreate
						// 1) Access and manipulate DOM nodes created in
						// buildRendering()
						// 2) Add new DOM nodes or widgets
						postCreate : function() {
//							alert("initLabels");
//							this.initLabels();
							// console.log("post create");
							// var preview = registry.byId("DW_PreviewMode");
							// this.setlPreviewMode(preview);
							// on(preview, "change", lang.hitch(this, this
							// .setlPreviewMode(preview)));
						},
						setlPreviewMode : function(preview) {
							preview = this.DW_PreviewMode;
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
					// setlPreviewMode : function(preview) {
					// if (DWObject) {
					//
					// DWObject.SetViewMode(
					// parseInt(preview.value) + 1,
					// parseInt(preview.value) + 1);
					// if (DynamLib.env.bMac) {
					// return;
					// } else if (parseInt(preview.value) != 0) {
					// DWObject.MouseShape = true;
					// } else {
					// DWObject.MouseShape = false;
					// }
					// }
					// }
					});
		});