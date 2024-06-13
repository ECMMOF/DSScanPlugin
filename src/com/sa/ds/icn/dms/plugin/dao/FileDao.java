package com.sa.ds.icn.dms.plugin.dao;

import java.sql.Date;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;

import com.sa.ds.icn.dms.plugin.bean.FileBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;

public class FileDao extends AbstractDAO {

	public FileDao() throws DatabaseException {
		super();
	}
	
	public Long addFile(FileBean bean) throws DatabaseException {
	    System.out.println("enter addFile sql method");
	    String sql = "INSERT INTO DMS_FILES (DOCUMENT_ID, DOCUMENT_CLASS, OCR_STATUS, USER_LDAP_NAME, NO_PAGES, SOURCE_ID, CREATED_DATE, MODIFIED_DATE, DOCUMENT_NAME, INTEGRATION_SYS_ID) "
	               + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	    try {

	        stmt = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
	        
	        stmt.setString(1, bean.getDocumentId());

	        stmt.setString(2, bean.getDocumentClass());

	        stmt.setInt(3, bean.getOcrStatus());

	        stmt.setString(4, bean.getUserLdapName());

	        stmt.setInt(5, bean.getNumberOfPages());

	        stmt.setInt(6, bean.getSourceId());

	        Date today = new Date(System.currentTimeMillis());
	        stmt.setDate(7, today);
	        stmt.setDate(8, today);

	        stmt.setString(9, bean.getDocumentName());

	        if (bean.getIntegrarionSysId() != 0) {
	            stmt.setInt(10, bean.getIntegrarionSysId());
	        } else {
	            stmt.setNull(10, Types.INTEGER);
	        }

	        stmt.executeUpdate();

	        rs = stmt.getGeneratedKeys();
	        
		    System.out.println("end addFile sql method");

	        if (rs.next()) {
	            return rs.getLong(1);
	        } else {
	            return null;
	        }
	    } catch (SQLException e) {
	        System.err.println("SQLException: " + e.getMessage());
	        throw new DatabaseException("Error adding file in folder", e);
	    }
	}

	public Long updateFile(FileBean bean, String oldDocumentId) throws DatabaseException {
	    String sql = "UPDATE DMS_FILES SET "
	               + "DOCUMENT_ID = ?, DOCUMENT_CLASS = ?, OCR_STATUS = ?, USER_LDAP_NAME = ?, NO_PAGES = ?, "
	               + "SOURCE_ID = ?, CREATED_DATE = ?, MODIFIED_DATE = ?, DOCUMENT_NAME = ?, INTEGRATION_SYS_ID = ? "
	               + "WHERE DOCUMENT_ID = ?";
	    try {
	        stmt = con.prepareStatement(sql);
	        
	        stmt.setString(1, bean.getDocumentId());
	        stmt.setString(2, bean.getDocumentClass());
	        stmt.setInt(3, bean.getOcrStatus());
	        stmt.setString(4, bean.getUserLdapName());
	        stmt.setInt(5, bean.getNumberOfPages());
	        stmt.setInt(6, bean.getSourceId());
	        
	        Date today = new Date(System.currentTimeMillis());
	        stmt.setDate(7, today);
	        stmt.setDate(8, today);
	        
	        stmt.setString(9, bean.getDocumentName());
	        if (bean.getIntegrarionSysId() != 0) {
	            stmt.setInt(10, bean.getIntegrarionSysId());
	        } else {
	            stmt.setNull(10, Types.INTEGER);
	        }
	        stmt.setString(11, oldDocumentId);
	        
	        stmt.executeUpdate();
	        
	        stmt = con.prepareStatement("SELECT FILE_ID FROM DMS_FILES WHERE DOCUMENT_ID = ?");
	        stmt.setString(1, bean.getDocumentId());
	        rs = stmt.executeQuery();
	        if (rs.next()) {
	            return rs.getLong(1);
	        }
	        return null;
	    } catch (SQLException e) {
	        throw new DatabaseException("Error updating file in folder", e);
	    }
	}

	
	public String getFileId(String documentId) throws DatabaseException {
		try {
			stmt = con.prepareStatement("SELECT FILE_ID FROM DMS_FILES WHERE DOCUMENT_ID = ?");
			stmt.setString(1, documentId);
			rs = stmt.executeQuery();
			if (rs.next()) {
				return rs.getString("FILE_ID");
			} else {
				return "-1";
			}
		} catch (Exception e) {
			throw new DatabaseException("Error fetching FILE_ID", e);
		}
	}

}
