/**
 * External dependencies
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Exporter from './exporter';
import { toggleAdvancedSettings, toggleSection } from 'lib/site-settings/exporter/actions';

class ExporterContainer extends Component {
	render() {
		const { dispatch, advancedSettings, site } = this.props;
		return (
			<Exporter
				site={ site }
				advancedSettings={ advancedSettings }
				toggleAdvancedSettings={ () => dispatch( toggleAdvancedSettings() ) }
				toggleSection={ ( section ) => dispatch( toggleSection( section ) ) } />
		);
	}
}

function select( state ) {
	return {
		advancedSettings: state.siteSettings.exporter.ui.toJS().advancedSettings,
	}
}

ExporterContainer.propTypes = {
	site: PropTypes.shape( {
		ID: PropTypes.number.isRequired
	} ),
	dispatch: PropTypes.func.isRequired
};

export default connect( select )( ExporterContainer );
