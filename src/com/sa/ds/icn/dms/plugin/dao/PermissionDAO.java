package com.sa.ds.icn.dms.plugin.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.sa.ds.icn.dms.plugin.bean.PermissionBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;


public class PermissionDAO  extends AbstractDAO {
	
	public PermissionDAO() throws DatabaseException {
		super();
	}
	
	
	public PermissionBean fetchPermission (Integer id) throws DatabaseException {
		Set<PermissionBean> results = fetchPermissions(id + "");
		if (results.size() == 0) {
			throw new DatabaseException("Permission with id '" + id + "' does not exist!");
		}
		return results.iterator().next();
	}
	
	public Set<PermissionBean> fetchPermissions (Set<Integer> ids) throws DatabaseException {
		String stringIds = ids.toString().replace("[", "").replace("]", "");
		return fetchPermissions(stringIds);
	}
	
	public Set<PermissionBean> fetchPermissions (String ids) throws DatabaseException {
		Set<PermissionBean> Permissions = new LinkedHashSet<PermissionBean>();
		String statement = "SELECT PermissionID, PermissionArName, PermissionEnName, PermissionDescription, MODULE_ID, ACTION_TYPE_ID, Enabled FROM PERMISSIONS";
		if (ids != null && !ids.equals("ALL")) {
			statement +=  " WHERE PermissionID in (" + ids + ")";
		}
		PreparedStatement stmt2 = null; 
		ResultSet rs2 = null;
		try {
			stmt = con.prepareStatement(statement);
			rs = stmt.executeQuery();
			while (rs.next()) {
				PermissionBean bean = new PermissionBean();
				
				bean.setId(rs.getInt("PermissionID"));
				bean.setNameAr(rs.getString("PermissionArName"));
				bean.setNameEn(rs.getString("PermissionEnName"));
				bean.setDescription(rs.getString("PermissionDescription"));
				bean.setModuleId(rs.getInt("MODULE_ID"));
				bean.setTypeId(rs.getInt("ACTION_TYPE_ID"));
				bean.setEnabled(rs.getBoolean("Enabled"));
			
				stmt2 = con.prepareStatement("SELECT  GROUP_ID FROM  GROUP_PERMISSIONS where PERMISSION_ID  = ?");
				stmt2.setInt(1, bean.getId());
				rs2 = stmt2.executeQuery();
				bean.setGroupIds(new LinkedHashSet<Integer>());
				while (rs2.next()) {
					bean.getGroupIds().add(rs2.getInt("GROUP_ID"));
				}
				
				Permissions.add(bean);				 		
			}
		} catch (SQLException e) {
			throw new DatabaseException("Error fetching record from table PERMISSIONS", e);
		} finally {
			if (rs2 != null) {
				try {
					rs2.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			
			if (stmt2 != null) {
				try {
					stmt2.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return Permissions;
	}

	public Set<PermissionBean> fetchAllPermissions() throws DatabaseException {
		return fetchPermissions("ALL");
	}

	public List<PermissionBean> fetchPermissionsByUser(String userName) throws DatabaseException {
		StringBuilder sql = new StringBuilder(200);
		sql.append("SELECT P.PermissionID, P.PermissionArName, P.PermissionEnName, P.MODULE_ID, P.ACTION_TYPE_ID \n");
		sql.append("FROM USERS USERS \n");
		sql.append("JOIN USERS_GROUPS USER_GROUPS ON (USERS.USER_ID = USER_GROUPS.USER_ID) \n");
		sql.append("JOIN GROUP_PERMISSIONS GROUP_PERMISSIONS ON (USER_GROUPS.GROUP_ID = GROUP_PERMISSIONS.GROUP_ID) \n");
		sql.append("JOIN PERMISSIONS P ON (GROUP_PERMISSIONS.PERMISSION_ID = P.PermissionID) \n");
		sql.append("WHERE USERS.UsernameLDAP = ?");
		try {
			List<PermissionBean> beans = new ArrayList<PermissionBean>();
			stmt = con.prepareStatement(sql.toString());
			stmt.setString(1, userName);
			rs = stmt.executeQuery();
			while (rs.next()) {
				PermissionBean bean = new PermissionBean();
				bean.setId(rs.getInt("PermissionID"));
				bean.setNameAr(rs.getString("PermissionArName"));
				bean.setNameEn(rs.getString("PermissionEnName"));
				bean.setModuleId(rs.getInt("MODULE_ID"));
				bean.setTypeId(rs.getInt("ACTION_TYPE_ID"));
				beans.add(bean);
			}
			return beans;
		} catch (Exception e) {
			throw new DatabaseException("Error fetching permissions for user " + userName, e);
		}
	}
}
