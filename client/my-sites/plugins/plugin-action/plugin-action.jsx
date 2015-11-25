/**
 * External dependencies
 */
var React = require( 'react/addons' ),
	classNames = require( 'classnames' );

/**
 * Internal dependencies
 */
var CompactToggle = require( 'components/forms/form-toggle/compact' ),
	InfoPopover = require( 'components/info-popover' );

module.exports = React.createClass( {

	displayName: 'PluginAction',

	handleAction: function( event ) {
		if ( ! this.props.disabledInfo ) {
			this.props.action();
		} else {
			this.refs.infoPopover._onClick( event );
		}
	},

	renderLabel: function() {
		if ( this.props.label ) {
			return (
				<label
					className="plugin-action__label"
					ref="disabledInfoLabel"
					onClick={ this.handleAction }
					htmlFor={ this.props.htmlFor }
					>
					{ this.props.label }
				</label>
			);
		}
		return null;
	},

	renderDisabledInfo: function( id ) {
		return (
			<div className="plugin-action__disabled-info">
				<InfoPopover
					position="bottom left"
					popoverName={ 'Plugin Action Disabled' + this.props.label }
					gaEventCategory="Plugins"
					ref="infoPopover"
					ignoreContext={ this.refs && this.refs.disabledInfoLabel }
					>
					{ this.props.disabledInfo }
				</InfoPopover>
				{ this.renderLabel( id ) }
			</div>
		);
	},

	renderToggle: function( id ) {
		return (
			<CompactToggle
				onChange={ this.props.action }
				checked={ this.props.status }
				toggling={ this.props.inProgress }
				disabled={ this.props.disabled }
				id={ id }
			>
				{ this.renderLabel( id ) }
			</CompactToggle>
		);
	},

	renderChildren: function( id ) {
		return (
			<div>
				<span className="plugin-action__children">{ this.props.children }</span>
				{ this.renderLabel( id ) }
			</div>
		);
	},

	renderInner: function() {
		var id = this.props.htmlFor;
		if ( this.props.disabledInfo ) {
			return this.renderDisabledInfo( id );
		}
		return (
		0 < React.Children.count( this.props.children )
			? this.renderChildren( id )
			: this.renderToggle( id )
		);
	},

	render: function() {
		return (
			<div className={ classNames( 'plugin-action', this.props.className ) }>
				{ this.renderInner() }
			</div>
		);
	}
} );
