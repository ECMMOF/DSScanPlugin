package com.sa.ds.icn.dms.plugin.dao;

import java.sql.SQLException;
import java.util.LinkedHashSet;
import java.util.Set;

import com.sa.ds.icn.dms.plugin.bean.ConfigBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;

public class ConfigDAO extends AbstractDAO{

	public ConfigDAO() throws DatabaseException {
		super();
	}

	public Set<ConfigBean> fetchAllConfigs() throws DatabaseException{
		Set<ConfigBean> configs = new LinkedHashSet<ConfigBean>();
		try {
			stmt = con.prepareStatement("SELECT NAME, ISNULL(VALUE, '') VALUE, COMMENT , IsEncrypted FROM CONFIG ORDER BY NAME");
			rs = stmt.executeQuery();
			while (rs.next()) {	
				ConfigBean bean = new ConfigBean();
				bean.setName(rs.getString("NAME"));
				bean.setValue(rs.getString("VALUE"));
				bean.setIsEncrypted(rs.getBoolean("IsEncrypted"));
				bean.setComment(rs.getString("COMMENT"));
				configs.add(bean);
			}
		}catch (SQLException e) {
			throw new DatabaseException("Error fetching record from table CONFIG", e);
		} 
		return configs;
	}
}
