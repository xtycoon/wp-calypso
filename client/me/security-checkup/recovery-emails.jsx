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
import FormFieldSet from 'components/forms/form-fieldset';
import FormTextInput from 'components/forms/form-text-input';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormButton from 'components/forms/form-button';
import ActionRemove from 'me/action-remove';

module.exports = React.createClass( {
	displayName: 'SecurityCheckupRecoveryEmails',

	mixins: [ React.addons.LinkedStateMixin ],

	componentDidMount: function() {
		AccountRecoveryStore.on( 'change', this.refreshRecoveryEmails );
	},

	componentWillUnmount: function() {
		AccountRecoveryStore.off( 'change', this.refreshRecoveryEmails );
	},

	getInitialState: function() {
		return {
			recoveryEmail: '',
			recoveryEmails: AccountRecoveryStore.getEmails(),
			isAddingRecoveryEmail: false,
			isSavingRecoveryEmail: false
		};
	},

	refreshRecoveryEmails: function() {
		if ( ! AccountRecoveryStore.isSavingRecoveryEmail() ) {
			if ( this.state.isAddingRecoveryEmail ) {
				this.setState( { isAddingRecoveryEmail: false } );
			}
		}

		this.setState( {
			recoveryEmails: AccountRecoveryStore.getEmails(),
			isSavingRecoveryEmail: AccountRecoveryStore.isSavingRecoveryEmail()
		} );
	},

	addEmail: function() {
		this.setState( { isAddingRecoveryEmail: true } );
	},

	saveEmail: function() {
		SecurityCheckupActions.updateEmail( this.state.recoveryEmail );
		this.setState( { isSavingRecoveryEmail: true } );
	},

	deleteEmail: function( recoveryEmail ) {
		SecurityCheckupActions.deleteEmail( recoveryEmail );
	},

	cancelEmail: function() {
		this.setState( { isAddingRecoveryEmail: false } );
	},

	renderRecoveryEmail: function( recoveryEmail ) {
		return (
			<li key={ recoveryEmail.email } className="security-checkup__recovery-email-container">
				<span className="security-checkup__recovery-email">{ recoveryEmail.email }</span>
				<ActionRemove onClick={ this.deleteEmail.bind( this, recoveryEmail.email ) } />
			</li>
		);
	},

	getRecoveryEmails: function() {
		if ( isEmpty( this.state.recoveryEmails.data ) ) {
			return(
				<p>No recovery emails</p>
			);
		}

		return (
			<ul className="security-checkup__recovery-emails-list">
				{ this.state.recoveryEmails.data.map( recoveryEmail => this.renderRecoveryEmail( recoveryEmail ) ) }
			</ul>
		);
	},

	renderRecoveryEmailsPlaceholder: function() {
		return(
			<div className="security-checkup__recovery-emails-placholder">
				<div className="security-checkup__recovery-emails">
					<FormSectionHeading>placeholder heading</FormSectionHeading>
					<ul className="security-checkup__recovery-emails-list">
						<li className="security-checkup__recovery-email">placeholder@placeholder.com</li>
					</ul>
				</div>
				<div className="security-checkup__recovery-email-actions">
					<FormButton>
						placeholder
					</FormButton>
				</div>
			</div>
		);
	},

	renderRecoveryEmails: function() {
		return(
			<div className="security-checkup__recovery-emails">
				<FormSectionHeading>{ this.translate( 'Recovery emails' ) }</FormSectionHeading>
				{ this.getRecoveryEmails() }
			</div>
		);
	},

	renderRecoveryEmailActions: function() {
		if ( this.state.isAddingRecoveryEmail ) {
			return(
				<div className="security-checkup__recovery-email-actions">
					<FormFieldSet>
						<FormTextInput valueLink={ this.linkState( 'recoveryEmail' ) } ></FormTextInput>
						<FormSettingExplanation>{ this.translate( 'Your primary email address is {{email/}}', { components: { email: <strong>n.prasath.002@gmail.com</strong> } } ) }</FormSettingExplanation>
					</FormFieldSet>
					<FormButtonsBar>
						<FormButton onClick={ this.saveEmail } >
							{ this.state.isSavingRecoveryEmail ? this.translate( 'Saving' ) : this.translate( 'Save' ) }
						</FormButton>
						<FormButton onClick={ this.cancelEmail } isPrimary={ false } >
							{ this.translate( 'Cancel' ) }
						</FormButton>
					</FormButtonsBar>
				</div>
			);
		}

		return(
			<div className="security-checkup__recovery-email-actions">
				<FormButton onClick={ this.addEmail } isPrimary={ false } >
					{ this.translate( 'Add Email' ) }
				</FormButton>
			</div>
		);
	},

	render: function() {
		if ( this.state.recoveryEmails.loading ) {
			return this.renderRecoveryEmailsPlaceholder();
		}

		return (
			<div className="security-checkup__recovery-emails-container">
				{ this.renderRecoveryEmails() }
				{ this.renderRecoveryEmailActions() }
			</div>
		);
	}
} );
