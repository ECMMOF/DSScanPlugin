package com.sa.ds.icn.dms.plugin.audit;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.sa.ds.icn.dms.plugin.bean.DMSAuditBean;
import com.sa.ds.icn.dms.plugin.dao.AuditDao;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;
import com.sa.ds.icn.dms.plugin.util.ConfigManager;

public class AuditGenerator {
	private HttpServletRequest request;
	private JSONObject jsonResponse;
	private PluginServiceCallbacks callbacks;
	private String serverType;	
	JSONArray properties;

	public AuditGenerator(HttpServletRequest request, JSONObject jsonResponse, PluginServiceCallbacks callbacks, String serverType, JSONArray properties) throws Exception {
		this.request = request;
		this.jsonResponse = jsonResponse;
		this.callbacks = callbacks;
		this.serverType = serverType;	
		this.properties = properties;
	}

	public void generateAudit(Long fileId) throws Exception {	
		Operation op = Operation.getOperationByName(serverType);
		if (!Operation.AUDITED_OPERATIONS.contains(op.name())) {
			return;
		}
		
		switch(op) {
			case OPEN_ITEM: logOpenItemAudit(); break;
			case DELETE_ITEM: logDeleteItem(); break;
			case ADD_ITEM: logAddItem(fileId); break;
			case EDIT_ATTRIBUTES: logEditAttributesAudit(); break;
			case CHECKIN: logEditItemAudit(fileId); break;
			case SEARCH: logSearchAudit(); break;
			case LOCK:
			case UNLOCK:
				logLockingAudit();
				break;
			case LOGON: 
			default: 
				logAudit(new DMSAuditBean()); break;
		}
	}

	private void logAddItem(Long fileId) {
		try {
			JSONArray rows = (JSONArray)jsonResponse.get("rows");
			if (rows.size() == 0) {
				return; 
			}
			JSONObject row = (JSONObject) rows.get(0);
			String id = (String) row.get("id");
			DocumentID dId = new DocumentID(id);
			DMSAuditBean bean = new DMSAuditBean();
			bean.setFileId(fileId);
			bean.setDocumentClass(dId.getDocumentClass());
			bean.setDocumentId(dId.getDocumentId());
			JSONObject attributes = (JSONObject) row.get("attributes");
			Map<String, String> editedAttributes = new HashMap<>();
			for (Object key : attributes.keySet()) {
				if (((String)key).equals("thumbnail")) {
					continue;
				}
				String attributeName = (String)key;
				JSONArray attributeList = (JSONArray) attributes.get(key);
				
				JSONObject isSystem = (JSONObject) attributeList.get(6);
				if (attributeName.equals("DocumentTitle") || ((boolean)isSystem.get("isSystem") == false)) {

					if ( attributeList.get(0) instanceof JSONArray ) {	
						String attributeValue = null;
						JSONArray attributeValueArr = (JSONArray) attributeList.get(0);  
						 if (attributeValueArr.size() > 0) {
							 StringBuilder sb = new StringBuilder();
							 attributeValue = "";
							 for (Object s : attributeValueArr) {
								 sb.append(s).append(","); } 
							 	 attributeValue = sb.deleteCharAt(sb.length() - 1).toString(); 
							 }
							editedAttributes.put(attributeName, attributeValue);

					}else {
						String attributeValue = (String)attributeList.get(0);
						editedAttributes.put(attributeName, attributeValue);

					}
					
				}
			}
			bean.setProperties(editedAttributes);
			logAudit(bean);
		} catch (Exception e) {
			System.out.println("Error getting edited attributes of document");
			e.printStackTrace();
		}
	}

	private void logDeleteItem() {
		JSONArray deletedDocuments = (JSONArray) jsonResponse.get("deletedItemIds");
		int size = deletedDocuments.size();
		if (size > 0) {
			for (Iterator itr = deletedDocuments.iterator(); itr.hasNext();) {
				String id = (String)itr.next();
				try {
					DMSAuditBean bean = new DMSAuditBean();
					DocumentID did = new DocumentID(id);
					bean.setDocumentClass(did.getDocumentClass());
					bean.setDocumentId(did.getDocumentId());
					logAudit(bean);
				} catch (Exception e) {
					System.err.println("Error adding audit log for Delete operation");
					e.printStackTrace();
				}
			}
		}
	}

	private void logEditAttributesAudit() {		
		try {
			JSONArray rows = (JSONArray)jsonResponse.get("rows");
			JSONObject row = (JSONObject) rows.get(0);
			String id = (String) row.get("id");
			DocumentID dId = new DocumentID(id);
			DMSAuditBean bean = new DMSAuditBean();
			bean.setDocumentClass(dId.getDocumentClass());
			bean.setDocumentId(dId.getDocumentId());
			JSONObject attributes = (JSONObject) row.get("attributes");
			Map<String, String> editedAttributes = new HashMap<>();
			for (Object key : attributes.keySet()) {
				if (((String)key).equals("thumbnail")) {
					continue;
				}
				JSONArray attributeList = (JSONArray) attributes.get(key);
				JSONObject isSystem = (JSONObject) attributeList.get(6);
				if ((boolean)isSystem.get("isSystem") == false) {
					String attributeName = (String)key;

					if ( attributeList.get(0) instanceof JSONArray ) {	
						String attributeValue = null;
						JSONArray attributeValueArr = (JSONArray) attributeList.get(0);  
						 if (attributeValueArr.size() > 0) {
							 StringBuilder sb = new StringBuilder();
							 attributeValue = "";
							 for (Object s : attributeValueArr) {
								 sb.append(s).append(","); } 
							 	 attributeValue = sb.deleteCharAt(sb.length() - 1).toString(); 
							 }
							editedAttributes.put(attributeName, attributeValue);

					}else {
						String attributeValue = (String)attributeList.get(0);
						editedAttributes.put(attributeName, attributeValue);

					}
					
				}
			}
			bean.setProperties(editedAttributes);
			logAudit(bean);
		} catch (Exception e) {
			System.out.println("Error getting edited attributes of document");
			e.printStackTrace();
		}
	}

	private void logSearchAudit() {
		DMSAuditBean bean = new DMSAuditBean();
		String criterias = request.getParameter("criterias");
		try {
			JSONArray criteria = JSONArray.parse(criterias);
			Map<String, String> searchedFields = new HashMap<>(criteria.size());
			for (Iterator itr = criteria.iterator(); itr.hasNext();) {
				JSONObject cr = (JSONObject)itr.next();
				String name = (String) cr.get("name");
				String operator = cr.get("operator") + " " ;
				JSONArray values = (JSONArray)cr.get("values");
				String value = "";
				for (Iterator vItr = values.iterator(); vItr.hasNext();) {
					String v = (String) vItr.next();
					if (!v.isEmpty()) {
						value += v + "; ";
					}
				}
				if (value.trim().length() > 0) {
					searchedFields.put(name, operator + ": " + value);
				}
			}
			bean.setProperties(searchedFields);
			logAudit(bean);
		} catch (Exception e) {
			System.err.println("Error adding audit log for Search operation");
			e.printStackTrace();
		}
	}

	private void logEditItemAudit(Long fileId) {
		JSONArray rows = (JSONArray) jsonResponse.get("rows");
		if ((rows == null || rows.isEmpty()) && (properties == null || properties.isEmpty())) {
			return;
		}
		
		
		try {
			DMSAuditBean bean = new DMSAuditBean();
			if (!rows.isEmpty()) {
			JSONObject row = (JSONObject) rows.get(0);
			
			String id = (String)row.get("id");
			if (id == null) {
				return;
			}
			DocumentID dId = new DocumentID(id);
			bean.setFileId(fileId);
			bean.setDocumentClass(dId.getDocumentClass());
			bean.setDocumentId(dId.getDocumentId());
			
			Object attObj = row.get("attributes");
			if (attObj != null) {
				JSONObject attributes = (JSONObject) attObj;
				Map<String, String> editedAttributes = new HashMap<>();
				for (Object key : attributes.keySet()) {
					if (((String)key).equals("thumbnail")) {
						continue;
					}
					String attributeName = (String)key;
					JSONArray attributeList = (JSONArray) attributes.get(key);
					JSONObject isSystem = (JSONObject) attributeList.get(6);
					if (attributeName.equals("DocumentTitle") || ((boolean)isSystem.get("isSystem") == false)) {

						if ( attributeList.get(0) instanceof JSONArray ) {	
							String attributeValue = null;
							JSONArray attributeValueArr = (JSONArray) attributeList.get(0);  
							 if (attributeValueArr.size() > 0) {
								 StringBuilder sb = new StringBuilder();
								 attributeValue = "";
								 for (Object s : attributeValueArr) {
									 sb.append(s).append(","); } 
								 	 attributeValue = sb.deleteCharAt(sb.length() - 1).toString(); 
								 }
								editedAttributes.put(attributeName, attributeValue);

						}else {
							String attributeValue = (String)attributeList.get(0);
							editedAttributes.put(attributeName, attributeValue);

						}
						
					}
				}
				bean.setProperties(editedAttributes);	
			}
			}else if(!properties.isEmpty()) {
				String id = request.getParameter("docid");
				if (id !=null && !id.equalsIgnoreCase("") && !id.equalsIgnoreCase("null")){
//					String documentClass = request.getParameter("template_name");
					String documentClass = id.split(",")[0];
					String documentId = id.split(",")[2];
					if (documentId != null) {
						documentId = documentId.replace("{", "").replace("}", "");
					}
					
					bean.setFileId(fileId);
					bean.setDocumentClass(documentClass);
					bean.setDocumentId(documentId);
	 				Map<String, String> editedAttributes = new HashMap<>();

					 for (Object obj : properties) {
			        	 if (obj instanceof JSONObject) {
			                 JSONObject jsonObj = (JSONObject) obj;
			                 String name = (String) jsonObj.get("name");
			                 String vlaue = (String) jsonObj.get("value");
			                 if(!name.equals("CmFederatedLockStatus") && !name.equals("ComponentBindingLabel") && !name.equals("ClbSecurityController")
			                		 && !name.equals("EntryTemplateId") && !name.equals("EntryTemplateLaunchedWorkflowNumber") 
			                		 && !name.equals("EntryTemplateObjectStoreName") && !name.equals("ComponentBindingLabel") && !name.equals("OwnerDocument")
			                		 && !name.equals("DependentDocuments") && !name.equals("PublishingSubsidiaryFolder") && !name.equals("IgnoreRedirect")) {
			                	 editedAttributes.put(name, vlaue);
			                 }

			                 
			             }
			        }
						bean.setProperties(editedAttributes);	

				}
			}
			
			logAudit(bean);
		} catch (Exception e) {
			System.err.println("Error adding audit log for item operation");
			e.printStackTrace();
		}
	}

	private void logLockingAudit() {
		JSONArray rows = (JSONArray) jsonResponse.get("rows");
		if (rows == null || rows.isEmpty()) {
			return;
		}
		
		String id = (String)((JSONObject)rows.get(0)).get("id");
		if (id == null) {
			return;
		}
		
		try {
			DocumentID dId = new DocumentID(id);
			DMSAuditBean bean = new DMSAuditBean();
			bean.setDocumentClass(dId.getDocumentClass());
			bean.setDocumentId(dId.getDocumentId());
			logAudit(bean);
		} catch (Exception e) {
			System.err.println("Error adding audit log for item operation");
			e.printStackTrace();
		}
	}
	
	private void logOpenItemAudit() {
		try {
			DMSAuditBean bean = new DMSAuditBean();
			String docId = request.getParameter("docid");
			DocumentID did = new DocumentID(docId);
			bean.setDocumentClass(did.getDocumentClass());
			bean.setDocumentId(did.getDocumentId());
			logAudit(bean);
		} catch (Exception e) {
			System.err.println("Error adding audit log for Open Item operation");
			e.printStackTrace();
		}
	}
	
	private void logAudit(DMSAuditBean bean) {
		if ("StoredSearch".equalsIgnoreCase(bean.getDocumentClass()) || "Folder".equalsIgnoreCase(bean.getDocumentClass())) {
			return;
		}
		String userId = callbacks.getUserId();
		if (userId == null) {
			userId = request.getParameter("userId");
		}
		
		bean.setDate(new Timestamp(System.currentTimeMillis()));
		bean.setUsername(userId);
		bean.setOperation(Operation.getOperationByName(serverType));

		try (AuditDao auditDao = new AuditDao()) {
			auditDao.addDMSAudit(bean);
		} catch (DatabaseException e) {
			System.err.println("Error saving audit log in database");
			e.printStackTrace();
		}
	}
	
	public static void logIntegrationAudit(DMSAuditBean bean) {
		if ("StoredSearch".equalsIgnoreCase(bean.getDocumentClass()) || "Folder".equalsIgnoreCase(bean.getDocumentClass())) {
			return;
		}
		try (AuditDao auditDao = new AuditDao()) {
			auditDao.addDMSAudit(bean);
		} catch (DatabaseException e) {
			System.err.println("Error saving audit log in database");
			e.printStackTrace();
		}
	}

}
