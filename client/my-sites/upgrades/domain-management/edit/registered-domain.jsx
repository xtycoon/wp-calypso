/**
 * External dependencies
 */
import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import analyticsMixin from 'lib/mixins/analytics';
import Card from 'components/card/compact';
import config from 'config';
import Flag from 'components/flag';
import DomainWarnings from 'my-sites/upgrades/components/domain-warnings';
import Header from './card/header';
import paths from 'my-sites/upgrades/paths';
import Property from './card/property';
import SubscriptionSettings from './card/subscription-settings';
import VerticalNav from 'components/vertical-nav';
import VerticalNavItem from 'components/vertical-nav/item';

const RegisteredDomain = React.createClass( {
	mixins: [ analyticsMixin( 'domainManagement', 'edit' ) ],

	getAutoRenewalOrExpirationDate() {
		const domain = this.props.domain;

		if ( domain.isAutoRenewing ) {
			return (
				<Property label={ this.translate( 'Renews on' ) }>
					{ domain.autoRenewalDate }
				</Property>
			);
		}

		return (
			<Property label={ this.translate( 'Expires on' ) }>
				{ domain.expirationDate }
			</Property>
		);
	},

	getPrivacyProtection() {
		if ( this.props.domain.hasPrivacyProtection ) {
			return (
				<Flag
					type="is-success"
					icon="noticon-lock">
					{ this.translate( 'On', {
						context: 'An icon label when Privacy Protection is enabled.'
					} ) }
				</Flag>
			);
		}

		return (
			<Flag
				type="is-warning"
				icon="noticon-warning"
				onClick={ this.goToPrivacyProtection }>
				{ this.translate( 'None', {
					context: 'An icon label when Privacy Protection is disabled.'
				} ) }
			</Flag>
		);
	},

	handlePaymentSettingsClick() {
		this.recordEvent( 'paymentSettingsClick', this.props.domain );
	},

	domainWarnings() {
		return <DomainWarnings
			domain={ this.props.domain }
			selectedSite={ this.props.selectedSite }
			ruleWhiteList={ [ 'expiredDomains', 'expiringDomains', 'newDomainsWithPrimary', 'newDomains' ] } />;
	},

	getVerticalNav() {
		if ( this.props.domain.expired ) {
			return null;
		}

		return (
			<VerticalNav>
				{ this.emailNavItem() }
				{ this.nameServersNavItem() }
				{ this.contactsPrivacyNavItem() }
				{ this.transferNavItem() }
			</VerticalNav>
		);
	},

	emailNavItem() {
		const path = paths.domainManagementEmail(
			this.props.selectedSite.domain,
			this.props.domain.name
		);

		return (
			<VerticalNavItem path={ path }>
				{ this.translate( 'Email' ) }
			</VerticalNavItem>
		);
	},

	nameServersNavItem() {
		if ( ! config.isEnabled( 'upgrades/domain-management/name-servers' ) ) {
			return null;
		}

		const path = paths.domainManagementNameServers(
			this.props.selectedSite.domain,
			this.props.domain.name
		);

		return (
			<VerticalNavItem path={ path }>
				{ this.translate( 'Name Servers and DNS' ) }
			</VerticalNavItem>
		);
	},

	contactsPrivacyNavItem() {
		if ( ! config.isEnabled( 'upgrades/domain-management/contacts-privacy' ) ) {
			return null;
		}

		const path = paths.domainManagementContactsPrivacy(
			this.props.selectedSite.domain,
			this.props.domain.name
		);

		return (
			<VerticalNavItem path={ path }>
				{ this.translate( 'Contacts and Privacy' ) }
			</VerticalNavItem>
		);
	},

	transferNavItem() {
		if ( ! config.isEnabled( 'upgrades/domain-management/transfer' ) ) {
			return null;
		}

		const path = paths.domainManagementTransfer(
			this.props.selectedSite.domain,
			this.props.domain.name
		);

		return (
			<VerticalNavItem path={ path }>
				{ this.translate( 'Transfer Domain' ) }
			</VerticalNavItem>
		);
	},

	render() {
		const domain = this.props.domain;

		return (
			<div>
				{ this.domainWarnings() }
				<div className="domain-details-card">
					<Header { ...this.props } />

					<Card>
						<Property label={ this.translate( 'Type', { context: 'A type of domain.' } ) }>
							{ this.translate( 'Registered Domain' ) }
						</Property>

						<Property label={ this.translate( 'Registered on' ) }>
							{ domain.registrationDate }
						</Property>

						{ this.getAutoRenewalOrExpirationDate() }

						<Property label={ this.translate( 'Privacy Protection' ) }>
							{ this.getPrivacyProtection() }
						</Property>

						<SubscriptionSettings
							onClick={ this.handlePaymentSettingsClick } />
					</Card>
				</div>

				{ this.getVerticalNav() }
			</div>
		);
	},

	goToPrivacyProtection() {
		this.recordEvent( 'noneClick', this.props.domain );

		page( paths.domainManagementPrivacyProtection( this.props.selectedSite.domain, this.props.domain.name ) );
	}
} );

export default RegisteredDomain;
