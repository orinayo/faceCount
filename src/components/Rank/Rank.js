import React, { Component } from 'react'

class Rank extends Component {
  constructor (props) {
    super(props)
    this.state = {
      emoji: ''
    }
  }

  componentDidMount () {
    this.generateEmoji(this.props.entries)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.entries === this.props.entries && prevProps.name === this.props.name) {
      return null
    }
    this.generateEmoji(this.props.entries)
  }

  generateEmoji = entries => {
    fetch(`https://emh8rj564b.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
      .then(res => res.json())
      .then(data => this.setState({
        emoji: data.input
      }))
      .catch(console.log)
  }

  render () {
    const { name, entries } = this.props
    return (
      <div>
        <div className='white f3'>
          {`${name} your current entry count is...`}
        </div>
        <div className='white f1'>
          {entries}
        </div>
        <div className='white f3'>
          {`Rank Badge: ${this.state.emoji}`}
        </div>
      </div>
    )
  }
}

export default Rank
