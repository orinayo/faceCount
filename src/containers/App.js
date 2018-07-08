import React, {
  Component
} from 'react'
import Particles from 'react-particles-js'
import Navigation from '../components/Navigation/Navigation'
import Signin from '../components/Signin/Signin'
import Register from '../components/Register/Register'
import Logo from '../components/Logo/Logo'
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm'
import Rank from '../components/Rank/Rank'
import FaceRecognition from '../components/FaceRecognition/FaceRecognition'
import './App.css'

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  calculateFacePosition = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.querySelector('#inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  setFaceBoxValues = (box) => {
    this.setState({
      box: box
    })
  }

  onSubmit = () => {
    const {
      input,
      user: {
        id
      }
    } = this.state

    this.setState({
      imageUrl: input
    })
    fetch('https://guarded-plateau-34914.herokuapp.com/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: input
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res) {
          fetch('https://guarded-plateau-34914.herokuapp.com/image', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: id
              })
            })
            .then(res => res.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {
                entries: count
              }))
            })
            .catch(console.log)
        }
        this.setFaceBoxValues(this.calculateFacePosition(res))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({
        isSignedIn: true
      })
    }
    this.setState({
      route: route
    })
  }

  loadUser = (data) => {
    const {
      id,
      name,
      email,
      entries,
      joined
    } = data
    this.setState({
      user: {
        id: id,
        name: name,
        email: email,
        entries: entries,
        joined: joined
      }
    })
  }

  render() {
      const {
        imageUrl,
        box,
        route,
        isSignedIn,
        user: {
          name,
          entries
        }
      } = this.state
    return ( 
      <div className = 'App'>
        <Particles className = 'particles'
        params = {
          particlesOptions
        } /> 
        <Navigation onRouteChange = {
            this.onRouteChange
          }
          isSignedIn = {
            isSignedIn
          } />
        { route === 'home' ? 
          <div>
            <Logo />
            <Rank name = {
              name
            } 
            entries = {
              entries
            } />
            <ImageLinkForm onInputChange = {
              this.onInputChange
            }
            onSubmit = {
              this.onSubmit
            } /> 
            <FaceRecognition imageUrl = {
              imageUrl
            } 
            box = {
              box
            } />
          </div> :
          (
            route === 'signin' ?
              <Signin onRouteChange = {
                this.onRouteChange
              }
              loadUser = {
                this.loadUser
              } /> :
              <Register onRouteChange = {
                this.onRouteChange
              }
              loadUser = {
                this.loadUser
              } />
          )
        } 
      </div>
    )
  }
}

export default App
