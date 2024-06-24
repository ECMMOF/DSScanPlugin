package com.sa.ds.icn.dms.plugin.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

import com.sa.ds.icn.dms.plugin.bean.ConfigBean;
import com.sa.ds.icn.dms.plugin.dao.ConfigDAO;

public class ConfigManager {
	private static Properties props;
	private static Map<String, String> watermarkAttributesMap = new HashMap<String, String>();
	
	static {
		props = new Properties();
		loadProps();
	}
	
	public static void loadProps() {
		try (ConfigDAO dao = new ConfigDAO()) {
			Set<ConfigBean> beans = dao.fetchAllConfigs();
			for (ConfigBean b : beans) {
				if(b.IsEncrypted() == true) {
					props.put(b.getName(), EncryptionUtil.decrypt(b.getValue()));
				}else {
					props.put(b.getName(), b.getValue());
				}
			}
			
			if (beans != null && beans.size() > 0) {
				watermarkAttributesMap.putAll(
						props.entrySet()
						.stream()
						.filter(c -> c.getKey().toString().startsWith("F_"))
						.collect(Collectors.toMap(e -> e.getKey().toString(), e -> e.getValue().toString()))
					);
				System.out.println("Configurations have been loaded successfully!");
			} else {
				System.err.println("Failed to open the configuration file");
			}
		} catch (SecurityException e) {
			System.err.println("Failed to access resources folder due to the following error: " + e.getMessage());
			e.printStackTrace();
		} catch(Exception e){
			System.err.println("Failed to initiate config due to the following error: " + e.getMessage());
			e.printStackTrace();
		}
	}
	


	public static String getAuditedOperations() {
		return props.getProperty("AUDITED_OPERATIONS");
	}
	
	public static String getAttributeForDocumentName() {
		return props.getProperty("ATTRIBUTE_FOR_DOCUMENT_NAME");
	}

	public static String getFileNetURI() {
		return props.getProperty("FILENET_URI");
	}

	public static String getFileNetStanza() {
		return "FileNetP8WSI";
	}

	public static String getFileNetObjectStoreName() {
		return props.getProperty("FILENET_OBJECT_STORE_NAME");
	}
	
	public static String getFileNetUsername() {
		return props.getProperty("FILENET_USERNAME");
	}
	
	public static String getFileNetPassword() {
		return props.getProperty("FILENET_PASSWORD");
	}

	public static double getStartingPositionLeft() {
		return Double.parseDouble(props.getProperty("WATERMARK_STARTING_POSITION_LEFT", "0"));
	}

	public static double getStartingPositionTop() {
		return Double.parseDouble(props.getProperty("WATERMARK_STARTING_POSITION_TOP", "0"));
	}

	public static int getOccurrencesPerRow() {
		return Integer.parseInt(props.getProperty("WATERMARK_OCCURRENCES_PER_ROW", "0"));
	}

	public static int getOccurrencesPerColumn() {
		return Integer.parseInt(props.getProperty("WATERMARK_OCCURRENCES_PER_COLUMN", "0"));
	}
	
	public static String getIntegrationDatasourceName() {
		return props.getProperty("INTEGRATION_DATASOURCE_NAME");
	}

	public static String getIntegrationFileNetURI() {
		return props.getProperty("INTEGRATION_FILENET_URL");
	}
	
	public static String getIntegrationFileNetUsername() {
		return props.getProperty("INTEGRATION_FILENET_USERNAME");
	}
	
	public static String getIntegrationFileNetPassword() {
		return props.getProperty("INTEGRATION_FILENET_PASSWORD");
	}

	public static String getIntegrationFileNetObjectStoreName() {
		return props.getProperty("INTEGRATION_FILENET_OBJECTSTORE_NAME");
	}

	public static String getSuperUserName() {
		return props.getProperty("SECURITY_SUPER_USER_NAME");
	}

}
