/**
 * External dependencies
 */
import React from 'react';
import isEmpty from 'lodash/lang/isEmpty';

/**
 * Internal dependencies
 */
import AccountRecoveryStore from 'lib/security-checkup/account-recovery-store';
import SecurityCheckupActions from 'lib/security-checkup/actions';
import FormSectionHeading from 'components/forms/form-section-heading';
import FormButton from 'components/forms/form-button';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormPhoneInput from 'components/forms/form-phone-input';
import FormTextInput from 'components/forms/form-text-input';
import countriesList from 'lib/countries-list';
import wpcomLib from 'lib/wp';

const wpcom = wpcomLib.undocumented();

// @TODO initialise phone input data

module.exports = React.createClass( {
	displayName: 'SecurityCheckupRecoveryPhone',

	mixins: [ React.addons.LinkedStateMixin ],

	componentDidMount: function() {
		AccountRecoveryStore.on( 'change', this.refreshRecoveryPhone );
	},

	componentWillUnmount: function() {
		AccountRecoveryStore.off( 'change', this.refreshRecoveryPhone );
	},

	getInitialState: function() {
		return {
			recoveryPhone: AccountRecoveryStore.getPhone(),
			recoveryPhoneScreen: 'recoveryPhone',
			verificationCode: '',
			isSavingRecoveryPhone: false,
			isVerifyingCode: false,
			isSendingCode: false
		};
	},

	refreshRecoveryPhone: function() {
		this.setState( {
			recoveryPhone: AccountRecoveryStore.getPhone(),
			isSavingRecoveryPhone: AccountRecoveryStore.isSavingRecoveryPhone()
		} );
	},

	edit: function() {
		this.setState( { recoveryPhoneScreen: 'editRecoveryPhone' } );
	},

	sendCode: function() {
		// @TODO check phone data is not empty

		wpcom.me().newAccountRecoveryPhone( this.state.phoneNumber.countryData.code, this.state.phoneNumber.phoneNumber, ( error ) => {
			if ( error ) {
				// display a message unable to send code please try again later
				return;
			}

			this.setState( { recoveryPhoneScreen: 'verfiyRecoveryPhone' } );
		} );
	},

	verifyCode: function() {
		// @TODO check verification code is valid and not empty

		wpcom.me().validateAccountRecoveryPhone( this.state.verificationCode, ( error ) => {
			if ( error ) {
				// display a message unable to send code please try again later
				return;
			}

			this.setState( { recoveryPhoneScreen: 'recoveryPhone' } );
		} );
	},

	cancel: function() {
		this.setState( { recoveryPhoneScreen: 'recoveryPhone' } );
	},

	onChangePhoneInput: function( phoneNumber ) {
		this.setState( { phoneNumber } );
	},

	recoveryPhonePlaceHolder: function() {
		return(
			<div>
				<FormSectionHeading>Recovery phone placeholder</FormSectionHeading>
				<p>Recovery phone placeholder</p>
				<FormButton onClick={ this.edit } isPrimary={ false } >
					{ this.translate( 'Edit Phone' ) }
				</FormButton>
			</div>
		);
	},

	getRecoveryPhone: function() {
		if ( isEmpty( this.state.recoveryPhone.data ) ) {
			return(
				<p>No recovery phone</p>
			);
		}

		return (
			<p>{ this.state.recoveryPhone.data.numberFull }</p>
		);
	},

	recoveryPhone: function() {
		return (
			<div>
				<FormSectionHeading>Recovery phone</FormSectionHeading>
				{ this.getRecoveryPhone() }
				<FormButton onClick={ this.edit } isPrimary={ false } >
					{ this.translate( 'Edit Phone' ) }
				</FormButton>
			</div>
		);
	},

	editRecoveryPhone: function() {
		return(
			<div>
				<FormPhoneInput
					countriesList={ countriesList.forSms() }
					initialCountryCode="LK"
					initialPhoneNumber="775143910"
					onChange={ this.onChangePhoneInput }
					/>
				<FormButtonsBar>
					<FormButton onClick={ this.sendCode } >
						{ this.state.isSendingCode ? this.translate( 'Sending code' ) : this.translate( 'Send code' ) }
					</FormButton>
					<FormButton onClick={ this.cancel }  isPrimary={ false } >
						{ this.translate( 'Cancel' ) }
					</FormButton>
				</FormButtonsBar>
			</div>
		);
	},

	verfiyRecoveryPhone: function() {
		return(
			<div>
				<FormTextInput valueLink={ this.linkState( 'verificationCode' ) } ></FormTextInput>
				<FormButtonsBar>
					<FormButton onClick={ this.verifyCode } >
						{ this.state.isVerifyingCode ? this.translate( 'verifying' ) : this.translate( 'Verify code' ) }
					</FormButton>
					<FormButton onClick={ this.cancel }  isPrimary={ false } >
						{ this.translate( 'Cancel' ) }
					</FormButton>
				</FormButtonsBar>
			</div>
		);
	},

	getRecoveryPhoneScreen: function() {
		if ( this.state.recoveryPhone.loading ) {
			return this.recoveryPhonePlaceHolder();
		}

		switch ( this.state.recoveryPhoneScreen ) {
			case 'recoveryPhone':
				return this.recoveryPhone();
			case 'editRecoveryPhone':
				return this.editRecoveryPhone();
			case 'verfiyRecoveryPhone':
				return this.verfiyRecoveryPhone();
			default:
				return this.recoveryPhone();
		}
	},

	render: function() {
		return (
			<div>
				{ this.getRecoveryPhoneScreen() }
			</div>
		);
	}
} );
