/**
 * External dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var StepWrapper = require( 'signup/step-wrapper' ),
	Input = require( 'components/forms/form-text-input-with-affixes' ),
	SelectDropdown = require( 'components/select-dropdown' ),
	productsList = require( 'lib/products-list' )(),
	Card = require( 'components/card' ),
	SimpleNotice = require( 'notices/simple-notice' ),
	SignupActions = require( 'lib/signup/actions' );

module.exports = React.createClass( {
	displayName: 'MlbDomainsStep',

	getInitialState: function() {
		return { siteUrl: '' };
	},

	handleNameChange: function( event ) {
		event.preventDefault();
		this.setState( { siteUrl: event.target.value } );
	},

	handleSubmit: function( event ) {
		event.preventDefault();

		const siteUrl = this.state.siteUrl,
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
				<Input placeholder="yourname" onChange={ this.handleNameChange } name="domain" suffix={ this.renderProducts() }/>
				<button onClick={ this.handleSubmit } className='button is-primary'>
					{ this.translate( 'Continue' ) }
				</button>

			</Card>
			);
	},

	renderProducts: function() {
		var options = [],
			products = productsList.get();
		products = Object.keys( products ).map( ( k ) => products[ k ] );
		options = [ { value: '.mlblogs.com', label: '.mlbslogs.com Free' } ];

		products = products.filter( p => p.is_domain_registration );
		// Filter domaing registration. (Not present on mlblogs.com)
		products = products.filter( p => p.product_slug !== 'domain_reg' );
		products = products.map( p => {
			let cost = p.cost === 0 ? ' Free' : ' ' + p.cost_display + ' / Year';
			return {
				value: p.product_slug,
				label: p.product_name + cost
			};
		} );
		options = options.concat( products );
		return <SelectDropdown options={ options } />
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
					headerText={ this.translate( 'Welcome to MLB.com/blogs.' ) }
					fallbackHeaderText={ this.translate( 'Let\'s find a domain.' ) }
					fallbackSubHeaderText={ this.translate( 'Choose a custom domain, or a free .wordpress.com address.' ) }
					subHeaderText={ this.translate( 'First up, let\'s find a domain.' ) }
					flowName={ this.props.flowName }
					stepName={ this.props.stepName }
					positionInFlow={ this.props.positionInFlow }
					stepContent={ content } { ...this.props } goToNextStep={ false } />

					<div>
						{ this.translate( 'You agree to the {{a}}fascinating terms of service{{/a}} by submitting this form.', {
							components: {
								a: <a href="http://wordpress.com/tos/" target="_blank" />
							}
						} ) }
					</div>
			</div>
			);
	}
} );
