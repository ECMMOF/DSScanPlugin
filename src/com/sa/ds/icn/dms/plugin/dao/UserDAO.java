package com.sa.ds.icn.dms.plugin.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashSet;
import java.util.Set;

import com.sa.ds.icn.dms.plugin.bean.UserBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;

public class UserDAO extends   AbstractDAO {

	public UserDAO() throws DatabaseException {
		super();
	}
	
	private Set<Integer > fetchUserGroupIds(int userId) throws DatabaseException {
		Set<Integer> groupIds = new LinkedHashSet<Integer>();
		PreparedStatement stmt2 = null;
		ResultSet rs2 = null;
		try {
			stmt2 = con.prepareStatement("SELECT GROUP_ID FROM USERS_GROUPS WHERE USER_ID = ?");
			stmt2.setInt(1, userId);
			rs2 = stmt2.executeQuery();
			while (rs2.next()) {
				groupIds.add(rs2.getInt("GROUP_ID"));
			}
		} catch (SQLException e) {
			throw new DatabaseException("Error fetching record from table User", e);
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
		return groupIds;
	}

	public UserBean fetchUserByNameLDAP(String userNameLDAP) throws DatabaseException {
		try {
			stmt = con.prepareStatement("SELECT USER_ID, UserArname, UserEnName, UsernameLDAP, IsLogin, IsActive, DEPARTMENT_ID  FROM USERS WHERE UsernameLDAP = ?");
			stmt.setString(1, userNameLDAP);
			rs = stmt.executeQuery();
			if (rs.next()) {
				UserBean bean = new UserBean();
				bean.setId(rs.getInt("USER_ID"));
				bean.setNameAr(rs.getString("UserArname"));
				bean.setNameEn(rs.getString("UserEnName"));
				bean.setUsernameLDAP(rs.getString("UsernameLDAP"));
				bean.setIsLogin(rs.getBoolean("IsLogin"));
				bean.setIsActive(rs.getBoolean("IsActive"));
				bean.setDepartmentId(rs.getInt("DEPARTMENT_ID"));
				
				bean.setGroupsIds(fetchUserGroupIds(bean.getId()));
				return bean;
			}
		} catch (SQLException e) {
			throw new DatabaseException("Error fetching record from table User", e);
		}
		return null;
	}
}