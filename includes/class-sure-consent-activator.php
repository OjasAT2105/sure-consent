<?php

/**
 * Fired during plugin activation
 *
 * @link       https://https://profiles.wordpress.org/brainstormforce/
 * @since      1.0.0
 *
 * @package    Sure_Consent
 * @subpackage Sure_Consent/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Sure_Consent
 * @subpackage Sure_Consent/includes
 * @author     BrainStorrm Force <ojas@bsf.io>
 */
class Sure_Consent_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		// Create consent logs table
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-sure-consent-storage.php';
		Sure_Consent_Storage::create_table();
	}

}
