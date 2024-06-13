package com.sa.ds.icn.dms.plugin.dao;

	

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Hashtable;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.sa.ds.icn.dms.plugin.exception.DatabaseException;

public abstract class AbstractDAO implements AutoCloseable {
	protected static final String DATA_SOURCE_NAME = "ARCHIVE_MOF";
	protected Connection con;
	protected PreparedStatement stmt;
	protected ResultSet rs;

	public AbstractDAO() throws DatabaseException {
		initConn();
	}

	public AbstractDAO(String datasourceName) throws DatabaseException {
		initConn(datasourceName);
	}

//    private Connection getConnection(String dataSource) throws SQLException, NamingException, DatabaseException {
//        InitialContext initContext;
//        javax.sql.DataSource source = null;
//        Hashtable<String, String> hashtable = new Hashtable<String, String>();
//        hashtable.put("java.naming.factory.initial", "com.ibm.websphere.naming.WsnInitialContextFactory");
//        initContext = new InitialContext(hashtable);
//        source = (javax.sql.DataSource)initContext.lookup(dataSource);
//        if (source != null) {
//        	return source.getConnection();
//        } else {
//        	throw new DatabaseException("Error looking up datasource '" + dataSource + "'");
//        }
//    }
	private Connection getConnection(String dataSource) throws SQLException, NamingException, DatabaseException {
	    InitialContext initContext;
	    javax.sql.DataSource source = null;
	    Hashtable<String, String> hashtable = new Hashtable<String, String>();
	    hashtable.put("java.naming.factory.initial", "com.ibm.websphere.naming.WsnInitialContextFactory");
	    
	    try {
	        initContext = new InitialContext(hashtable);
	        source = (javax.sql.DataSource) initContext.lookup(dataSource);
	        
	        if (source != null) {
	            return source.getConnection();
	        } else {
	            throw new DatabaseException("Error looking up datasource '" + dataSource + "'");
	        }
	    } catch (NamingException e) {
	        throw e;
	    } catch (SQLException e) {
	        throw e;
	    }
	}

	protected final void initConn() throws DatabaseException {
		initConn(DATA_SOURCE_NAME);
	}

	protected final void initConn(String datasourceName) throws DatabaseException {
		try {
			if ((this.con == null) || (this.con.isClosed())) {
				this.con = getConnection(datasourceName);
			}
		} catch (SQLException e) {
			throw new DatabaseException("Error getting connection to database", e);
		} catch (NamingException e) {
			throw new DatabaseException("Error getting connection to database", e);
		}
	}

	public final void close() {
		try {
			if (this.rs != null) {
				this.rs.close();
			}
		} catch (Exception unexpected) {
			unexpected.printStackTrace();
		}
		
		try {
			if (stmt != null) {
				stmt.close();
			}
		} catch (Exception unexpected) {
			unexpected.printStackTrace();
		}
		
		if (this.con != null) {
			try {
				this.con.close();
			} catch (SQLException unexpected) {
				unexpected.printStackTrace();
			}
		}
	}
}
