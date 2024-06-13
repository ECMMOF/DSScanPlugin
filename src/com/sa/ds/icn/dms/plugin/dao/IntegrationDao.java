package com.sa.ds.icn.dms.plugin.dao;

import java.util.ArrayList;
import java.util.List;

import com.sa.ds.icn.dms.plugin.bean.AttachmentBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;
import com.sa.ds.icn.dms.plugin.util.ConfigManager;

public class IntegrationDao extends AbstractDAO {

	public IntegrationDao() throws DatabaseException {
		super();
	}

	public List<AttachmentBean> fetchPendingTransactionAttachments(int transactionId) throws DatabaseException {
		List<AttachmentBean> beans = new ArrayList<>();
		StringBuffer sql = new StringBuffer(200);
		sql.append("SELECT MOAMALAT_ID, TITLE, VSID, ARCHIVED_ID, ARCHIVED_DATE, STATUS_ID ");
		sql.append("FROM MOAMALAT.dbo.IO_ARCHIVE_DOCUMENTS ");
		sql.append("WHERE (STATUS_ID IS NULL OR STATUS_ID = 0) AND TRANSACTIONID = ?");
		try {
			stmt = con.prepareStatement(sql.toString());
			stmt.setInt(1, transactionId);
			rs = stmt.executeQuery();
			while (rs.next()) {
				AttachmentBean b = new AttachmentBean();
				b.setArchiveDate(rs.getTimestamp("ARCHIVED_DATE"));
				b.setArchiveId(rs.getString("ARCHIVED_ID"));
				b.setMoamalatId(rs.getString("MOAMALAT_ID"));
				b.setStatus(rs.getObject("STATUS_ID", Boolean.class));
				b.setTitle(rs.getString("TITLE"));
				b.setTransactionId(transactionId);
				b.setVsid(rs.getString("VSID"));
				beans.add(b);
			}
			return beans;
		} catch (Exception e) {
			throw new DatabaseException("Error fetching transaction with id " + transactionId, e);
		}
	}

	public void updateAttachmentsTable(AttachmentBean bean) throws DatabaseException {
		String sql = "UPDATE MOAMALAT.dbo.IO_ARCHIVE_DOCUMENTS SET ARCHIVED_ID = ?, ARCHIVED_DATE = ?, STATUS_ID = ? WHERE MOAMALAT_ID = ?";
		try {
			stmt = con.prepareStatement(sql);
			stmt.setString(1, bean.getArchiveId());
			stmt.setTimestamp(2, bean.getArchiveDate());
			stmt.setBoolean(3, bean.getStatus());
			stmt.setString(4, bean.getMoamalatId());
			stmt.executeUpdate();
		} catch (Exception e) {
			throw new DatabaseException("Error updating integration attachments table", e);
		}
	}
}
