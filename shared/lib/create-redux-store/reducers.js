/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import sharing from 'lib/sharing/reducers';
import themes from 'lib/themes/reducers';

export default combineReducers( {
	sharing,
	themes
} );
