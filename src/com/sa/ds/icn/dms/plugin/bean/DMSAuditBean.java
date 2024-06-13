package com.sa.ds.icn.dms.plugin.bean;

import java.sql.Timestamp;
import java.util.Map;

import com.sa.ds.icn.dms.plugin.audit.Operation;

public class DMSAuditBean {
	private Timestamp date;
	private String username;
	private String departmentCode;
	private Operation operation;
	private String documentClass;
	private String documentId;
	private Long fileId;
	private Map<String, String> properties;

	public Timestamp getDate() {
		return date;
	}
	public void setDate(Timestamp date) {
		this.date = date;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Operation getOperation() {
		return operation;
	}
	public void setOperation(Operation operation) {
		this.operation = operation;
	}
	public String getDocumentClass() {
		return documentClass;
	}
	public void setDocumentClass(String documentClass) {
		this.documentClass = documentClass;
	}
	public String getDocumentId() {
		return documentId;
	}
	public void setDocumentId(String documentId) {
		this.documentId = documentId;
	}
	public String getDepartmentCode() {
		return departmentCode;
	}
	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}
	public Map<String, String> getProperties() {
		return properties;
	}
	public void setProperties(Map<String, String> properties) {
		this.properties = properties;
	}
	public Long getFileId() {
		return fileId;
	}
	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}
}
