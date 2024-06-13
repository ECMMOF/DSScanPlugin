package com.sa.ds.icn.dms.plugin.filters;

import javax.servlet.http.HttpServletRequest;

import com.filenet.api.constants.RefreshMode;
import com.filenet.api.core.Document;
import com.filenet.api.core.Factory;
import com.filenet.api.core.ObjectStore;
import com.filenet.api.property.FilterElement;
import com.filenet.api.property.PropertyFilter;
import com.filenet.api.util.Id;
import com.ibm.ecm.extension.PluginResponseFilter;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.sa.ds.icn.dms.plugin.audit.AuditGenerator;
import com.sa.ds.icn.dms.plugin.audit.Operation;
import com.sa.ds.icn.dms.plugin.bean.FileBean;
import com.sa.ds.icn.dms.plugin.bean.UserBean;
import com.sa.ds.icn.dms.plugin.dao.FileDao;
import com.sa.ds.icn.dms.plugin.dao.UserDAO;
import com.sa.ds.icn.dms.plugin.util.ConfigManager;
import com.sa.ds.icn.dms.plugin.util.FileNetConnection;

/**
 * Provides an abstract class that is extended to create a filter for responses
 * from a particular service. The response from the service is provided to the
 * filter in JSON format before it is returned to the web browser. The filter
 * can then modify that response, and the modified response is returned to the
 * web browser.
 */
public class AddFilesToFolder extends PluginResponseFilter {

	/**
	 * Returns an array of the services that are extended by this filter.
	 * 
	 * @return A <code>String</code> array of names of the services. These are
	 *         the servlet paths or Struts action names.
	 */
	public String[] getFilteredServices() {
		return new String[] { "/p8/addItem", "/p8/checkIn" };
	}

	/**
	 * Filters the response from the service.
	 * 
	 * @param serverType
	 *            A <code>String</code> that indicates the type of server that
	 *            is associated with the service. This value can be one or more
	 *            of the following values separated by commas:
	 *            <table border="1">
	 *            <tr>
	 *            <th>Server Type</th>
	 *            <th>Description</th>
	 *            </tr>
	 *            <tr>
	 *            <td><code>p8</code></td>
	 *            <td>IBM FileNet P8</td>
	 *            </tr>
	 *            <tr>
	 *            <td><code>cm</code></td>
	 *            <td>IBM Content Manager</td>
	 *            </tr>
	 *            <tr>
	 *            <td><code>od</code></td>
	 *            <td>IBM Content Manager OnDemand</td>
	 *            </tr>
	 *         	  <tr>
	 *         		<td><code>cmis</code></td>
	 *         		<td>Content Management Interoperability Services</td>
	 *         	  </tr>
	 *            <tr>
	 *            <td><code>common</code></td>
	 *            <td>For services that are not associated with a particular
	 *            server</td>
	 *            </tr>
	 *            </table>
	 * @param callbacks
	 *            An instance of the
	 *            <code>{@link com.ibm.ecm.extension.PluginServiceCallbacks PluginServiceCallbacks}</code>
	 *            class that contains functions that can be used by the service.
	 *            These functions provide access to plug-in configuration and
	 *            content server APIs.
	 * @param request
	 *            An <code>HttpServletRequest</code> object that provides the
	 *            request. The service can access the invocation parameters from
	 *            the request.
	 * @param jsonResponse
	 *            The <code>JSONObject</code> object that is generated by the
	 *            service. Typically, this object is serialized and sent as the
	 *            response. The filter modifies this object to change the
	 *            response that is sent.
	 * @throws Exception
	 *             For exceptions that occur when the service is running.
	 *             Information about the exception is logged as part of the
	 *             client logging and an error response is automatically
	 *             generated and returned.
	 */
	public void filter( String serverType, 
						PluginServiceCallbacks callbacks,
						HttpServletRequest request, 
						JSONObject jsonResponse
	) throws Exception {
		
		try {			
			
			String id = null;
			String documentClass = null;
			String documentId = null;
			String documentName = null;
			JSONArray properties =null ; 
			JSONArray rows = (JSONArray) jsonResponse.get("rows");
			if (!rows.isEmpty()) {
				JSONObject row =(JSONObject)rows.get(0); 
				id = (String)(row).get("id");
				documentName = getDocumentName(row);
				documentClass = id.split(",")[0];
				documentId = id.split(",")[2];
				if (documentId != null) {
					documentId = documentId.replace("{", "").replace("}", "");
				}
			} else {
				id = request.getParameter("docid");
				if (id !=null && !id.equalsIgnoreCase("") && !id.equalsIgnoreCase("null")){
					String propertiesStr = request.getParameter("properties");
		            properties = JSONArray.parse(propertiesStr);
		         
					
					documentName = getDocumentName(properties);
					documentClass = id.split(",")[0];
					documentId = id.split(",")[2];
					if (documentId != null) {
						documentId = documentId.replace("{", "").replace("}", "");
					}
				}else {
					// Document was not saved successfully
					return;
				}
			}
			
			String numberOfPagesStr = request.getParameter("numberOfPages");
			int numberOfPages = 0;
			if (numberOfPagesStr != null && !numberOfPagesStr.trim().equals("")) {
				numberOfPages = Integer.parseInt(numberOfPagesStr);
			}
			
			String sourceIdStr = request.getParameter("sourceId");
			int sourceId = 0;
			if (sourceIdStr != null && !sourceIdStr.trim().equals("")) {
				sourceId = Integer.parseInt(sourceIdStr);
			}
			
			FileBean fileBean = new FileBean();
			fileBean.setDocumentId(documentId);
			fileBean.setDocumentClass(documentClass);
			fileBean.setNumberOfPages(numberOfPages);
			fileBean.setSourceId(sourceId);
			fileBean.setDocumentName(documentName);
			
			String userId = callbacks.getUserId();
			if (userId == null) {
				userId = request.getParameter("userId");
			}

			fileBean.setUserLdapName(userId);


//			try (UserDAO userDao = new UserDAO()) {
//				UserBean userBean = userDao.fetchUserByNameLDAP(userId);
//				fileBean.setOwnerUserId(userBean.getId());
//				fileBean.setOwnerDepartmentId(userBean.getDepartmentId());
//			} catch (Exception e) {
//				throw new Exception("Error getting user information", e);
//			}
			
			Operation op = Operation.getOperationByName(serverType);
			Long fileId = null;
			System.out.println("Operation:  "+ op);
			try (FileDao fileDao = new FileDao()) {
				if (Operation.ADD_ITEM.equals(op)) {
					fileId = fileDao.addFile(fileBean);
				} else {
					String oldDocumentId = request.getParameter("oldDocId");
					fileId = fileDao.updateFile(fileBean, oldDocumentId);
				}
			} catch (Exception e) {
				throw new Exception("Error updating file information", e);
			}
			
			jsonResponse.put("fileId", fileId);
			
//			updateDocument(documentId, fileId);
			
			AuditGenerator generator = new AuditGenerator(request, jsonResponse, callbacks, serverType, properties);
			generator.generateAudit(fileId);
		} catch (Exception e) {
			System.err.println("Error adding file to folder");
			e.printStackTrace();
		}
	}

	private String getDocumentName(JSONObject row) {
		JSONObject attributes = (JSONObject) row.get("attributes");
		if (attributes == null) {
			return "";
		}
		
		JSONArray attribute = (JSONArray) attributes.get(ConfigManager.getAttributeForDocumentName());
		if (attribute == null) {
			return "";
		}
		
		return (String) attribute.get(0);
	}
	
	private void updateDocument(String documentId, Long fileId) {
		try (FileNetConnection con = new FileNetConnection(FileNetConnection.Target.ARCHIVE)) {
			// Get document and populate property cache.
			PropertyFilter pf = new PropertyFilter();
			pf.addIncludeProperty(new FilterElement(null, null, null, "FileID", null));
			ObjectStore os = con.getObjectStroe();
			Document doc = Factory.Document.fetchInstance(os, new Id("{" + documentId + "}"),pf );
	
			// Return document properties.
			com.filenet.api.property.Properties props = doc.getProperties();
	
			// Change property value.
			props.putValue("FileID", fileId.intValue());
	
			// Save and update property cache.
			doc.save(RefreshMode.REFRESH );
		} catch (Exception e) {
			System.err.println("Failed to set File ID " + fileId + " for document " + documentId);
			e.printStackTrace();
		}
	}
	private String getDocumentName(JSONArray properties) {
		// Access elements of the JSONArray
        for (Object obj : properties) {
        	 if (obj instanceof JSONObject) {
                 JSONObject jsonObj = (JSONObject) obj;
                 // Access values from the JSONObject
                 String name = (String) jsonObj.get("name");
                 if(name .equals(ConfigManager.getAttributeForDocumentName())) {
                	 return (String) jsonObj.get("value");
                 }

             }
        }
        return "";
	}
	
}
