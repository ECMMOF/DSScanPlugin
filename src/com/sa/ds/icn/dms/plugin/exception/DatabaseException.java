package com.sa.ds.icn.dms.plugin.exception;

public class DatabaseException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7981516899213505807L;

	public DatabaseException() {
	}

	public DatabaseException(String message) {
		super(message);
	}

	public DatabaseException(Throwable cause) {
		super(cause);
	}

	public DatabaseException(String message, Throwable cause) {
		super(message, cause);
	}

	public DatabaseException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

}
