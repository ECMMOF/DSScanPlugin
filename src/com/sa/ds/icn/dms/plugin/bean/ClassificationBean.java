package com.sa.ds.icn.dms.plugin.bean;

public class ClassificationBean {

	private int classificationId;
	private String nameAr;
	private String nameEn;
	private String symbolicName;
	private String code;
	private int parentId;
	private int saveTypeId;
	
	public int getClassificationId() {
		return classificationId;
	}
	public void setClassificationId(int classificationId) {
		this.classificationId = classificationId;
	}
	public String getNameAr() {
		return nameAr;
	}
	public void setNameAr(String nameAr) {
		this.nameAr = nameAr;
	}
	public String getNameEn() {
		return nameEn;
	}
	public void setNameEn(String nameEn) {
		this.nameEn = nameEn;
	}
	public String getSymbolicName() {
		return symbolicName;
	}
	public void setSymbolicName(String symbolicName) {
		this.symbolicName = symbolicName;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public int getParentId() {
		return parentId;
	}
	public void setParentId(int parentId) {
		this.parentId = parentId;
	}
	public int getSaveTypeId() {
		return saveTypeId;
	}
	public void setSaveTypeId(int saveTypeId) {
		this.saveTypeId = saveTypeId;
	}

	
}
