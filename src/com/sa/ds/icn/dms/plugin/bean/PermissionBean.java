package com.sa.ds.icn.dms.plugin.bean;

import java.util.Set;

public class PermissionBean {
	private int id;
	private String nameAr;
	private String nameEn;
	private String description;
	private boolean enabled;

	private int moduleId;
	private int typeId;
	
	private Set<Integer> groupIds;

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public Set<Integer> getGroupIds() {
		return groupIds;
	}
	
	public void setGroupIds(Set<Integer> groupIds) {
		this.groupIds = groupIds;
	}
	public int getModuleId() {
		return moduleId;
	}

	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}

	public int getTypeId() {
		return typeId;
	}

	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}
}
