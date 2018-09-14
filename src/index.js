import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default class HighlightedTextarea extends Component {
  static propTypes = {
    value: PropTypes.string,
    highlights: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func
  }

  static OPEN_MARK = '<mark>';
  static CLOSE_MARK = '</mark>';

  constructor(props) {
    super(props);
    this._backdropRef = React.createRef();
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
  }

  _handleInputChange(event) {
    this.props.onChange(event.target.value);
  }

  _handleScroll(event) {
    const scrollTop = event.target.scrollTop;
    this._backdropRef.current.scrollTop = scrollTop;
  }

  _handleRegexHighlight(input, payload) {
    return input.replace(payload, HighlightedTextarea.OPEN_MARK + '$&' + HighlightedTextarea.CLOSE_MARK);
  }

  _handleArrayHighlight(input, payload) {
    let offset = 0;
    payload.forEach(function(element) {
      // insert open tag
      var open = element[0] + offset;

      if (element[2]) {
        const OPEN_MARK_WITH_CLASS = '<mark class="' + element[2] + '">';
        input = input.slice(0, open) + OPEN_MARK_WITH_CLASS + input.slice(open);
        offset += OPEN_MARK_WITH_CLASS.length;
      } else {
        input = input.slice(0, open) + HighlightedTextarea.OPEN_MARK + input.slice(open);
        offset += HighlightedTextarea.OPEN_MARK.length;
      }

      // insert close tag
      var close = element[1] + offset;

      input = input.slice(0, close) + HighlightedTextarea.CLOSE_MARK + input.slice(close);
      offset += HighlightedTextarea.CLOSE_MARK.length;
    }, this);
    return input;
  }

  getHighlights() {
    let content = this.props.value;
    let highlights = this.props.highlights;
    let highlightMarks = content;

    // escape HTML
    content = content.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (content) {
      highlightMarks = this._handleArrayHighlight(content, highlights);
    }

    // this keeps scrolling aligned when input ends with a newline
    highlightMarks = highlightMarks.replace(new RegExp('\\n(' + HighlightedTextarea.CLOSE_MARK + ')?$'), '\n\n$1');

    // highlightMarks = highlightMarks.replace(new RegExp(HighlightedTextarea.OPEN_MARK, 'g'), '<mark>');
    // highlightMarks = highlightMarks.replace(new RegExp(HighlightedTextarea.CLOSE_MARK, 'g'), '</mark>');

    return highlightMarks;
  }

  render() {
    return (
      <div className={`rhta-container ${styles['rhta-container']}`} >
        <div className={`rhta-backdrop ${styles['rhta-backdrop']}`} ref={this._backdropRef}>
          <div
            className={`rhta-highlights rhta-content ${styles['rhta-highlights']} ${styles['rhta-content']}`}
            dangerouslySetInnerHTML={{__html: this.getHighlights()}}
          />
        </div>
        <textarea
          className={`rhta-input rhta-content ${styles['rhta-input']} ${styles['rhta-content']}`}
          onChange={this._handleInputChange}
          onScroll={this._handleScroll}
          onBlur={(e) => this.props.onBlur(e.target.value)}
          value={this.props.value}
        />
      </div>
    );
  }
}
