package com.sa.ds.icn.dms.plugin.bean;

public class FileBean {

	private long fileId;
	private String documentId;
	private String documentClass;
	private String documentName;
	private String UserLdapName;
	private int ownerUserId;
	private int ownerDepartmentId;
	private int numberOfPages;
	private int sourceId;
	private int integrarionSysId;
	private int OcrStatus;
	
	
	
	public int getIntegrarionSysId() {
		return integrarionSysId;
	}
	public void setIntegrarionSysId(int integrarionSysId) {
		this.integrarionSysId = integrarionSysId;
	}
	public String getDocumentClass() {
		return documentClass;
	}
	public void setDocumentClass(String documentClass) {
		this.documentClass = documentClass;
	}
	public long getFileId() {
		return fileId;
	}
	public void setFileId(long fileId) {
		this.fileId = fileId;
	}
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}

	public int getOwnerUserId() {
		return ownerUserId;
	}
	public void setOwnerUserId(int ownerUserId) {
		this.ownerUserId = ownerUserId;
	}
	public int getOwnerDepartmentId() {
		return ownerDepartmentId;
	}
	public void setOwnerDepartmentId(int ownerDepartmentId) {
		this.ownerDepartmentId = ownerDepartmentId;
	}
	public int getNumberOfPages() {
		return numberOfPages;
	}
	public void setNumberOfPages(int numberOfPages) {
		this.numberOfPages = numberOfPages;
	}
	public int getSourceId() {
		return sourceId;
	}
	public void setSourceId(int sourceId) {
		this.sourceId = sourceId;
	}
	public String getDocumentName() {
		return documentName;
	}
	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}
	public int getOcrStatus() {
		return OcrStatus;
	}
	public void setOcrStatus(int ocrStatus) {
		OcrStatus = ocrStatus;
	}
	public String getUserLdapName() {
		return UserLdapName;
	}
	public void setUserLdapName(String userLdapName) {
		UserLdapName = userLdapName;
	}
	
}
