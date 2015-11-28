/**
 * External dependencies
 */
var debug = require( 'debug' )( 'calypso:lib:security-checkup:account-recovery-store' ),
	assign = require( 'lodash/object/assign' ),
	remove = require( 'lodash/array/remove' ),
	isEmpty = require( 'lodash/lang/isEmpty' );

/**
 * Internal dependencies
 */
var Dispatcher = require( 'dispatcher' ),
	emitter = require( 'lib/mixins/emitter' ),
	actions = require( './constants' ).actions,
	messages = require( './constants' ).messages,
	me = require( 'lib/wp' ).undocumented().me();

var _initialized = false,
	_loading = false,
	_phone = {
		isSavingPhone: false,
		lastRequestStatus: {
			isSuccessfull: false,
			message: ''
		},
		data: {}
	},
	_emails = {
		isSavingEmail: false,
		lastRequestStatus: {
			isSuccessfull: false,
			message: ''
		},
		data: {}
	};

var AccountRecoveryStore = {
	isSavingRecoveryEmail: function() {
		return _emails.isSavingEmail;
	},

	isSavingRecoveryPhone: function() {
		return _phone.isSavingPhone;
	},

	getEmails: function() {
		fetchFromAPIIfNotInitialized();

		return assign( {
			loading: _loading
		}, _emails );
	},

	getPhone: function() {
		fetchFromAPIIfNotInitialized();

		return assign( {
			loading: _loading
		}, _phone );
	}
};

function emitChange() {
	AccountRecoveryStore.emit( 'change' );
}

function fetchFromAPIIfNotInitialized() {
	if ( _initialized ) {
		return;
	}

	_initialized = true;
	fetchFromAPI();
}

function fetchFromAPI() {
	if ( _loading ) {
		return;
	}

	_loading = true;
	me.getAccountRecovery( function( error, data ) {
		_loading = false;

		if ( error ) {
			// @TODO handle error
			return;
		}

		handleResponse( data );
	} );
}

function updatePhone( phone ) {
	_phone.data = assign( {}, phone );
}

function updateEmails( emails ) {
	_emails.data = emails
}

function removeEmail( deletedEmail ) {
	_emails.data = remove( _emails.data, function( recoveryEamil ) {
		return recoveryEamil.email !== deletedEmail;
	} );

	emitChange();
}

function handleResponse( data ) {
	if ( data.phone ) {
		updatePhone( {
			countryCode: data.phone.country_code,
			countryNumericCode: data.phone.country_numeric_code,
			number: data.phone.number,
			numberFull: data.phone.number_full
		} );
	}

	if ( data.emails ) {
		updateEmails( data.emails );
	}

	emitChange();
}

AccountRecoveryStore.dispatchToken = Dispatcher.register( function( payload ) {
	var action = payload.action;
	debug( 'action triggered', action.type, payload );

	switch ( action.type ) {
		case actions.UPDATE_ACCOUNT_RECOVERY_PHONE:
			_phone.isPhoneSaving = true;
			emitChange();
			break;

		case actions.RECEIVE_UPDATED_ACCOUNT_RECOVERY_PHONE:
			if ( action.error ) {
				_phone.lastRequestStatus.isSuccessfull = false;
				_phone.lastRequestStatus.message = action.error;
				emitChange();
				break;
			}

			_phone.lastRequestStatus.isSuccessfull = true;
			_phone.lastRequestStatus.message = messages.EMAIL_ADDED;

			emitChange();
			break;

		case actions.DELETE_ACCOUNT_RECOVERY_PHONE:
			emitChange();
			break;

		case actions.RECEIVE_DELETED_ACCOUNT_RECOVERY_PHONE:
			if ( action.error ) {
				break;
			}

			emitChange();
			break;

		case actions.UPDATE_ACCOUNT_RECOVERY_EMAIL:
			_emails.isSavingEmail = true;
			emitChange();
			break;

		case actions.RECEIVE_UPDATED_ACCOUNT_RECOVERY_EMAIL:
			_emails.isSavingEmail = false;
			if ( action.error ) {
				_emails.lastRequestStatus.isSuccessfull = false;
				_emails.lastRequestStatus.message = action.error;
				emitChange();
				break;
			}

			_emails.lastRequestStatus.isSuccessfull = true;
			_emails.lastRequestStatus.message = messages.EMAIL_ADDED;
			emitChange();
			break;

		case actions.DELETE_ACCOUNT_RECOVERY_EMAIL:
			emitChange();
			break;

		case actions.RECEIVE_DELETED_ACCOUNT_RECOVERY_EMAIL:
			if ( action.error ) {
				_emails.lastRequestStatus.isSuccessfull = false;
				_emails.lastRequestStatus.message = action.error;
				emitChange();
				break;
			}

			removeEmail( action.email );
			_emails.lastRequestStatus.isSuccessfull = true;
			_emails.lastRequestStatus.message = messages.EMAIL_DELETED; // @TODO display email here
			emitChange();
			break;
	}
} );

emitter( AccountRecoveryStore );

module.exports = AccountRecoveryStore;
