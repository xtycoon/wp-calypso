/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import sharing from 'lib/sharing/reducers';
import sites from 'lib/sites/reducers';

export default combineReducers( {
	sharing,
	sites
} );
