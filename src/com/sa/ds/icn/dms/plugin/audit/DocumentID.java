package com.sa.ds.icn.dms.plugin.audit;

public class DocumentID {
	private String documentClass;
	private String documentId;
	
	public DocumentID(String fullId) throws Exception {			
		String[] idParts = fullId.split(",");
		documentClass = idParts[0];
		if (idParts.length < 3) {
			throw new Exception("No document resturned");
		}
		
		documentId = idParts[2];
		if (documentId != null) {
			documentId = documentId.replace("{", "").replace("}", "");
		}
	}
	
	public String getDocumentClass() {
		return documentClass;
	}
	
	public String getDocumentId() {
		return documentId;
	}	
}
