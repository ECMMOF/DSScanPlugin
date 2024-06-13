define(
		[ "dojo/_base/declare","dojo/_base/lang","dojo/json","dijit/registry", ],

		function(declare,lang,JSON, registry) {
			return {
			 hideAdminsFromSecurity: function(securityPane) {
				// Start of hiding admin user
				//"p8admins,bootstrap,fntadmin";
				var adminlist = "p8admins,bootstrap,fntadmin";//lang.getObject("getSystemVariables").ADMINIS_TO_HIDE.variableDesc;
				var displayNameArray = adminlist.split(",");
				// TODO Iterate all childnodes for hide default permission
				// starts
				var firstChild= null;
				if(securityPane instanceof ecm.widget.SecurityPane)
					firstChild= securityPane._centerPane.childNodes[0];
				else
					firstChild  = securityPane._securityPane._centerPane.childNodes[0];
				
					var firstChildLen = firstChild.childNodes.length
					for (var i = 0; i < firstChildLen; i++) {
						var membersContainer = firstChild.childNodes[i];
						var memberLen = membersContainer.childNodes[1].childNodes.length
						// Check Member children
						for (var t = 0; t < memberLen - 1; t++) {
							var btnId = membersContainer.childNodes[1].childNodes[t].childNodes[0].id;
							var btn = registry.byId(btnId);
							var member = btn.get('label');
//							var member = membersContainer.childNodes[1].childNodes[t].childNodes[0].innerText;
							if (member) {
								var memName = member.trim().toLowerCase();
								if (displayNameArray.indexOf(member) > -1|| displayNameArray.indexOf(memName) > -1)
									membersContainer.childNodes[1].childNodes[t].style.display = "none";
							}
						}
					}
				
				
			}
		}
	});