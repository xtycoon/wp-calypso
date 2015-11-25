/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var StepWrapper = require( 'signup/step-wrapper' ),
	Input = require( 'components/forms/form-text-input-with-affixes' ),
	Card = require( 'components/card' ),
  SimpleNotice = require( 'notices/simple-notice' ),
	SignupActions = require( 'lib/signup/actions' );

module.exports = React.createClass( {
	displayName: 'MlbDomainsStep',

	getInitialState: function() {
		return { blogName: '' };
	},

	handleNameChange: function( event ) {
		event.preventDefault();
		this.setState( { blogName: event.target.value } );
	},

	handleSubmit: function( event ) {
		event.preventDefault();

		const siteUrl = this.state.blogName,
			domainItem = undefined;

		SignupActions.submitSignupStep( {
			processingMessage: this.translate( 'Adding your domain' ),
			stepName: this.props.stepName,
			siteUrl,
			stepSectionName: this.props.stepSectionName
		}, [], { domainItem } );

		this.props.goToNextStep();
	},

	renderForm: function() {
		return (
			<Card>
				<label htmlFor="domain">Blog Address</label>
				<Input placeholder="yourname" onChange={ this.handleNameChange } name="domain" suffix=".mlblogs.com"/>
				<button onClick={ this.handleSubmit } className='button is-primary'>
					{ this.translate( 'Continue' )}
				</button>

			</Card>
			);
	},

	render: function() {
    var content = this.renderForm();
    if ( this.props.step && 'invalid' === this.props.step.status ) {
			content = (
				<div className="domains-step__section-wrapper">
					<SimpleNotice status='is-error' showDismiss={ false }>
						{ this.props.step.errors.message }
					</SimpleNotice>
					{ content }
				</div>
			);
		}
		return (
			<div>

				<StepWrapper
					headerText={ this.translate( 'Welcome to MLB.com/blogs.' )}
					fallbackHeaderText={ this.translate( 'Let\'s find a domain.' )}
					fallbackSubHeaderText={ this.translate( 'Choose a custom domain, or a free .wordpress.com address.' )}
					subHeaderText={ this.translate( 'First up, let\'s find a domain.' )}
					flowName={ this.props.flowName }
					stepName={ this.props.stepName }
					positionInFlow={ this.props.positionInFlow }
					stepContent={ content } { ...this.props } goToNextStep={ false } />

					<div>
						You agree to the <a href="http://wordpress.com/tos/" target="_blank">fascinating terms of service</a> by submitting this form.
					</div>
			</div>
			);
	}
} );
