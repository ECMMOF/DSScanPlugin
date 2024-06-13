package com.sa.ds.icn.dms.plugin.bean;

import java.sql.Timestamp;

public class AttachmentBean {
	private String moamalatId;
	private String title;
	private String vsid;
	private String archiveId;
	private Timestamp archiveDate;
	private Boolean	status;
	private int	transactionId;
	public String getMoamalatId() {
		return moamalatId;
	}
	public void setMoamalatId(String moamalatId) {
		this.moamalatId = moamalatId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getVsid() {
		return vsid;
	}
	public void setVsid(String vsid) {
		this.vsid = vsid;
	}
	public String getArchiveId() {
		return archiveId;
	}
	public void setArchiveId(String archiveId) {
		this.archiveId = archiveId;
	}
	public Timestamp getArchiveDate() {
		return archiveDate;
	}
	public void setArchiveDate(Timestamp archiveDate) {
		this.archiveDate = archiveDate;
	}
	public Boolean getStatus() {
		return status;
	}
	public void setStatus(Boolean status) {
		this.status = status;
	}
	public int getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(int transactionId) {
		this.transactionId = transactionId;
	}
	
}
