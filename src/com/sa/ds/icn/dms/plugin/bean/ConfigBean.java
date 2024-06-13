package com.sa.ds.icn.dms.plugin.bean;

public class ConfigBean {

	private String name;
	private String value;
	private String comment;
	private boolean IsEncrypted ;
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public boolean IsEncrypted() {
		return IsEncrypted;
	}

	public void setIsEncrypted(boolean isEncrypted) {
		IsEncrypted = isEncrypted;
	}

}
