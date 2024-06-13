package com.sa.ds.icn.dms.plugin.exception;

public class FilterException extends Exception {

	public FilterException() {}

	public FilterException(String message) {
		super(message);
	}

	public FilterException(Throwable cause) {
		super(cause);
	}

	public FilterException(String message, Throwable cause) {
		super(message, cause);
	}

	public FilterException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

}
