package com.sa.ds.icn.dms.plugin.util;

import javax.security.auth.Subject;

import com.filenet.api.core.Connection;
import com.filenet.api.core.Domain;
import com.filenet.api.core.Factory;
import com.filenet.api.core.ObjectStore;
import com.filenet.api.util.UserContext;
import com.sa.ds.icn.dms.plugin.exception.FileNetException;

public class FileNetConnection implements AutoCloseable {
	private Target target;
	
	public enum Target {
		ARCHIVE, MOAMALAT;
	}
	
	public FileNetConnection(Target target) {
		this.target = target;
	}
	
	public ObjectStore getObjectStroe() throws FileNetException {
		if (target.equals(Target.ARCHIVE)) {
			return getArchiveObjectStroe();
		} else if (target.equals(Target.MOAMALAT)) {
			return getMoamalatObjectStroe();
		} else {
			throw new FileNetException("Target not set");
		}
	}
	
	private ObjectStore getArchiveObjectStroe() throws FileNetException {
        try {
        	Connection conn = Factory.Connection.getConnection(ConfigManager.getFileNetURI());
	        Subject sub = UserContext.createSubject(
	        		conn, 
	        		ConfigManager.getFileNetUsername().trim(), 
	        		ConfigManager.getFileNetPassword().trim(), 
	        		null);
	        UserContext uc = UserContext.get(); 
	        uc.pushSubject(sub);
	        Domain domain = Factory.Domain.fetchInstance(conn, null, null);	        
	        ObjectStore os = Factory.ObjectStore.fetchInstance(domain, ConfigManager.getFileNetObjectStoreName(), null);
	        return os;
        } catch (Exception e) {
        	throw new FileNetException("Failed to access Object Store", e);
        }
	}
	
	private ObjectStore getMoamalatObjectStroe() throws FileNetException {
        try {
        	Connection conn = Factory.Connection.getConnection(ConfigManager.getIntegrationFileNetURI());
	        Subject sub = UserContext.createSubject(
	        		conn, 
	        		ConfigManager.getIntegrationFileNetUsername().trim(), 
	        		ConfigManager.getIntegrationFileNetPassword().trim(), 
	        		null
	        );
	        UserContext uc = UserContext.get(); 
	        uc.pushSubject(sub);
	        Domain domain = Factory.Domain.getInstance(conn, "NRRCSTG");	        
	        ObjectStore os = Factory.ObjectStore.fetchInstance(domain, ConfigManager.getIntegrationFileNetObjectStoreName(), null);
	        return os;
        } catch (Exception e) {
        	throw new FileNetException("Failed to access Object Store", e);
        }
	}

	@Override
	public void close() {
		try {
			UserContext.get().popSubject();
		} catch (Exception e) {
			System.err.println("WARINING: Conntection to FileNet was not closed successfully");
			e.printStackTrace();
		}
	}
}
