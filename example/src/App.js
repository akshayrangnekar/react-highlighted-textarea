import React, { Component } from 'react'
import HighlightedTextArea from 'react-highlighted-textarea';

function calcHighlights(input) {
  if (input.length > 10) {
    return [
      [0, 5, 'first'], 
      [7, 10], 
      [input.length - 10, input.length - 5, 'next']
    ];
  }
  return [
    [0, 5]
  ];
}

const initialText = 'This is the initial text';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: initialText, 
      highlights: calcHighlights(initialText)
    }
  }

  handleChange(text) {
    const highlights = calcHighlights(text);
    // console.log(text);
    this.setState({
      text, highlights
    });
  }

  handleBlur(e) {
    console.log('Blur event', e);
  }

  render () {
    return (
      <div>
        <HighlightedTextArea value={this.state.text} highlights={this.state.highlights} onBlur={(e) => this.handleBlur(e)} onChange={(e) => this.handleChange(e)}/>
      </div>
    )
  }
}
