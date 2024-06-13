package com.sa.ds.icn.dms.plugin.audit;

import java.util.HashMap;
import java.util.Map;

public enum Operation {
	LOGON(1, "تسجيل الدخول", "Log on"),
	SEARCH(2, "بحث", "Search"),
	EDIT_ATTRIBUTES(3, "تعديل حقول الادخال", "Edit Attributes"),
	CHECKIN(4, "تعديل المرفق", "Check in"),
	UNLOCK(5, "الغاء حجز وثيقة", "Unlock"),
	LOCK(6, "حجز وثيقة", "Lock"),
	ADD_ITEM(7, "اضافة وثيقة", "Add Item"),
	OPEN_ITEM(8, "فتح وثيقة", "Open Item"),
	DELETE_ITEM(9, "حذف وثيقة", "Delete Item"),
	GET_DOCUMENT(10, "تنزيل المرفق", "Get Document");
	
	public static final String AUDITED_OPERATIONS = "LOGON,LOGOFF,GET_DOCUMENT,SEARCH,EDIT_ATTRIBUTES,ADD_ITEM,OPEN_ITEM,UNLOCK,LOCK,DELETE_ITEM,CHECKIN";

	private static Map<String, Operation> operationNameMap;	
	private int id;
	private String operationNameAr;
	private String operationNameEn;
	
	public String getOperationNameAr() {
		return operationNameAr;
	}

	public String getOperationNameEn() {
		return operationNameEn;
	}

	static {
		operationNameMap = new HashMap<String, Operation>();
		operationNameMap.put("/logon", LOGON);
		operationNameMap.put("/p8/getDocument", GET_DOCUMENT);
		operationNameMap.put("/p8/search", SEARCH);
		operationNameMap.put("/p8/editAttributes", EDIT_ATTRIBUTES);
		operationNameMap.put("/p8/addItem", ADD_ITEM);
		operationNameMap.put("/p8/openItem", OPEN_ITEM);
		operationNameMap.put("/p8/unlock", UNLOCK);
		operationNameMap.put("/p8/lock", LOCK);
		operationNameMap.put("/p8/deleteItem", DELETE_ITEM);
		operationNameMap.put("/p8/checkIn", CHECKIN);
	}
	
	Operation(int id, String operationNameAr, String operationNameEn) {
		this.id = id;
		this.operationNameAr = operationNameAr;
		this.operationNameEn = operationNameEn;
	}
	
	public int getId() {
		return id;
	}
	
	public static Operation getOperationByName(String name) {
		return operationNameMap.get(name);
	}
	
	public static Operation getOperationById(int optId) throws Exception {
		switch(optId) {
			case 1: return LOGON;
			case 2: return SEARCH;
			case 3: return EDIT_ATTRIBUTES;
			case 4: return CHECKIN;
			case 5: return UNLOCK;
			case 6: return LOCK;
			case 7: return ADD_ITEM;
			case 8: return OPEN_ITEM;
			case 9: return DELETE_ITEM;
			case 10: return GET_DOCUMENT;
			default: return null;
		}
	}

}
