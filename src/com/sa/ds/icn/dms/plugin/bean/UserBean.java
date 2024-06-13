package com.sa.ds.icn.dms.plugin.bean;

import java.util.Set;

public class UserBean {
 
	private int id;
	private String UsernameLDAP;
	private boolean IsLogin;
	private boolean IsActive;
	private String nameAr;
	private String nameEn;
	private int departmentId;
	
	private Set<Integer> GroupsIds;
	private Set<Integer> PermissionsIds;
	private Set<Integer> StorageCenterIds;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsernameLDAP() {
		return UsernameLDAP;
	}
	public void setUsernameLDAP(String usernameLDAP) {
		UsernameLDAP = usernameLDAP;
	}
	public boolean getIsLogin() {
		return IsLogin;
	}
	public void setIsLogin(boolean isLogin) {
		IsLogin = isLogin;
	}
	public boolean getIsActive() {
		return IsActive;
	}
	public void setIsActive(boolean isActive) {
		IsActive = isActive;
	}
	public Set<Integer> getGroupsIds() {
		return GroupsIds;
	}
	public void setGroupsIds(Set<Integer> groupsIds) {
		GroupsIds = groupsIds;
	}
	public Set<Integer> getPermissionsIds() {
		return PermissionsIds;
	}
	public void setPermissionsIds(Set<Integer> permissionsIds) {
		PermissionsIds = permissionsIds;
	}
	public Set<Integer> getStorageCenterIds() {
		return StorageCenterIds;
	}
	public void setStorageCenterIds(Set<Integer> storageCenterIds) {
		StorageCenterIds = storageCenterIds;
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
	public int getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(int departmentId) {
		this.departmentId = departmentId;
	}
		 
 
	
}
