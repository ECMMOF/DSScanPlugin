package com.sa.ds.icn.dms.plugin.dao;

import java.sql.SQLException;
import java.util.LinkedHashSet;
import java.util.Set;

import com.sa.ds.icn.dms.plugin.bean.ClassificationBean;
import com.sa.ds.icn.dms.plugin.exception.DatabaseException;

public class ClassificationDao extends AbstractDAO {

	public ClassificationDao() throws DatabaseException {
		super();
	}
	
	public Set<ClassificationBean> fetchCLassificationsByUserId(String userId) throws DatabaseException {
		StringBuilder sql = new StringBuilder(500);
		sql.append("SELECT DISTINCT \n");
		sql.append("CLASS.CLASSIFICATION_ID CLASS_ID,\n");
		sql.append("CLASS.CLASS_AR_NAME AR_NAME,\n");
		sql.append("CLASS.CLASS_EN_NAME EN_NAME, \n");
		sql.append("CLASS.SYMPOLIC_NAME SYMBOLIC_NAME,\n");
		sql.append("CLASS.PARENT_ID PARENT_ID,\n");
		sql.append("CLASS.SAVE_TYPE SAVE_TYPE,\n");
		sql.append("CLASS.CLASS_CODE CLASS_CODE\n");
		sql.append("FROM CLASSIFICTIONS CLASS\n");
		sql.append("INNER JOIN CLASS_DEPT CLASS_DEPT ON (CLASS.CLASSIFICATION_ID = CLASS_DEPT.CLASSIFICATION_ID)\n");
		sql.append("INNER JOIN DEPARTMENTS DEPARTMENTS ON (CLASS_DEPT.DEPT_ID = DEPARTMENTS.DEPT_ID)\n");
		sql.append("INNER JOIN USERS USERS ON (DEPARTMENTS.DEPT_ID = USERS.DEPARTMENT_ID)\n");
		sql.append("WHERE USERS.UsernameLDAP = ?");
		
		Set<ClassificationBean> beanSet = new LinkedHashSet<>();
		try {
			stmt = con.prepareStatement(sql.toString());
			stmt.setString(1, userId);
			rs = stmt.executeQuery();
			while (rs.next()) {
				ClassificationBean bean = new ClassificationBean();
				bean.setClassificationId(rs.getInt("CLASS_ID"));
				bean.setNameAr(rs.getString("AR_NAME"));
				bean.setNameEn(rs.getString("EN_NAME"));
				bean.setSymbolicName(rs.getString("SYMBOLIC_NAME"));
				bean.setParentId(rs.getInt("PARENT_ID"));
				bean.setCode(rs.getString("CLASS_CODE"));
				bean.setSaveTypeId(rs.getInt("SAVE_TYPE"));
				beanSet.add(bean);
			}
			return beanSet;
		} catch (SQLException e) {
			throw new DatabaseException("Error fetching classification for user with id " + userId, e);
		}
	}

}
