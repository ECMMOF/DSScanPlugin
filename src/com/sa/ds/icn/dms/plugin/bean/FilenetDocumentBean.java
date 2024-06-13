package com.sa.ds.icn.dms.plugin.bean;

import java.util.Map;

public class FilenetDocumentBean {
	private Map<String, String> properties;
	private Map<String, byte[]> contents;
	
	public Map<String, String> getProperties() {
		return properties;
	}
	public void setProperties(Map<String, String> propsMap) {
		this.properties = propsMap;
	}
	public Map<String, byte[]> getContents() {
		return contents;
	}
	public void setContents(Map<String, byte[]> contents) {
		this.contents = contents;
	}
}
