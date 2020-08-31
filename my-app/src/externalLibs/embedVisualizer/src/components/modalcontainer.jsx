import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from "prop-types";
var createReactClass = require('create-react-class');
const ESC = 27;

const ModalContainer = createReactClass({
  propTypes: {
    currentModal: PropTypes.func,
    close: PropTypes.func,
    transitionName: PropTypes.string,
    enterDuration: PropTypes.number.isRequired,
    exitDuration: PropTypes.number.isRequired
  },

  getDefaultProps() {
    return { transitionName: 'modal', enterDuration: 190, exitDuration: 190 };
  },

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  },

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  onKeyDown(event) {
    if (event.keyCode === ESC) {
      this.props.close();
    }
  },

  render() {
    const content = this.props.currentModal ? (
      <div className='fixed top-0 left-0 bottom-0 right-0'>
        <div className='absolute top-0 left-0 w-100 h-100 bg-black-50' onClick={this.props.close} />
        <div className='w-100 h-100 flex items-center justify-center'>
          {this.props.currentModal(this.props)}
        </div>
      </div>
    ) : null;

    return (
      <ReactCSSTransitionGroup
        transitionName={this.props.transitionName}
        transitionEnterTimeout={this.props.enterDuration}
        transitionLeaveTimeout={this.props.exitDuration}
      >
        {content}
      </ReactCSSTransitionGroup>
    );
  },
});


export default ModalContainer;
