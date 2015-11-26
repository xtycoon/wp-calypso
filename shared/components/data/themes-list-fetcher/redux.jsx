/**
 * External dependencies
 */
import React from 'react';
import pick from 'lodash/object/pick';
import omit from 'lodash/object/omit';
import once from 'lodash/function/once';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Constants from 'lib/themes/constants';
import * as allActions from 'lib/themes/actions';
import { getThemeById } from 'lib/themes/reducers/themes';
import { getThemesList, getQueryParams, isLastPage, isFetchingNextPage } from 'lib/themes/reducers/themes-list';

const actions = pick( allActions, [
	'query',
	'fetchNextPage',
	'incrementThemesPage',
	'fetchThemes',
	'fetchJetpackThemes',
] );

function getThemesState( state ) {
	return {
		themes: getThemesInList( state ),
		lastPage: isLastPage( state.themesList ),
		loading: isFetchingNextPage( state.themesList ),
		search: getQueryParams( state.themesList ).search
	};
}

function getThemesInList( state ) {
	return getThemesList( state.themesList ).map( themeId =>
		getThemeById( state.themes, themeId ) );
}

let ThemesListFetcher = React.createClass( {
	propTypes: {
		children: React.PropTypes.element.isRequired,
		site: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool
		] ).isRequired,
		isMultisite: React.PropTypes.bool,
		search: React.PropTypes.string,
		tier: React.PropTypes.string,
		onRealScroll: React.PropTypes.func,
		onLastPage: React.PropTypes.func
	},

	queryThemes: function() {
		const {
			onLastPage,
			site,
			search,
			tier,

			query,
			fetchNextPage
		} = this.props;

		this.onLastPage = onLastPage ? once( onLastPage ) : null;

		query( {
			search,
			tier,
			page: 0,
			perPage: Constants.PER_PAGE,
		} );

		fetchNextPage( site );
	},

	fetchNextPage: function( options ) {
		// FIXME: While this function is passed on by `ThemesList` to `InfiniteList`,
		// which has a `shouldLoadNextPage()` check (in scroll-helper.js), we can't
		// rely on that; fetching would break without the following check.
		if ( this.props.loading || this.props.lastPage ) {
			return;
		}

		const {
			site = false,
			onRealScroll = () => null,

			// actions assumed bound to dispatch
			incrementThemesPage,
			fetchThemes,
			fetchJetpackThemes,
		} = this.props;

		if ( options.triggeredByScroll ) {
			onRealScroll();
		}

		const fetcher = site.jetpack ? fetchJetpackThemes : fetchThemes;
		incrementThemesPage( site );
		fetcher( site );
	},

	render: function() {
		const props = omit( this.props, 'children' );
		return React.cloneElement( this.props.children, Object.assign( {}, props, {
			fetchNextPage: this.fetchNextPage
		} ) );
	}

} );

module.exports = connect(
	state => getThemesState( state.themes ),
	bindActionCreators.bind( null, actions )
)( ThemesListFetcher );
