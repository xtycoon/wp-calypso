/**
 * External dependencies
 */
import filter from 'lodash/collection/filter';
import pluck from 'lodash/collection/pluck';

// TODO: DRY, reuse these selectors in ./stores
export function isJetpack( state ) {
	return state.themes.themesLastQuery.get( 'isJetpack' );
}

export function getParams( state ) {
	return state.themes.themesLastQuery.get( 'lastParams' ) || {};
}

export function getThemes( state ) {
	return state.themes.themes.get().get( 'themes' ).toJS();
}

export function searchJetpackThemes( state ) {
	const { themesList } = state.themes;

	if ( ! isJetpack( state ) ) {
		return state;
	}

	const { search } = getParams( state );
	const themes = search
		? filter( getThemes( state ), theme => matches( theme, search ) )
		: getThemes( state );

	return themesList.set( 'list', pluck( themes, 'id' ) );
}

function matches( theme, rawSearch ) {
	const search = rawSearch.toLowerCase().trim();

	return [ 'name', 'tags', 'description', 'author' ].some( field => (
		theme[ field ] && join( theme[ field ] )
			.toLowerCase().replace( '-', ' ' )
			.indexOf( search ) >= 0
	) );
}

function join( value ) {
	return Array.isArray( value ) ? value.join( ' ' ) : value;
}
