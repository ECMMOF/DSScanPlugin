package com.sa.ds.icn.dms.plugin.exception;

public class FileNetException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FileNetException() {
	}

	public FileNetException(String message) {
		super(message);
	}

	public FileNetException(Throwable cause) {
		super(cause);
	}

	public FileNetException(String message, Throwable cause) {
		super(message, cause);
	}

	public FileNetException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

}
