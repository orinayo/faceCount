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
import Modal from '../components/Modal/Modal'
import Profile from '../components/Profile/Profile'
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
  boxes: [],
  route: 'signin',
  isProfileOpen: false,
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    age: ''
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:3001/signin', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:3001/profile/${data.id}`, {
                method: 'get',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                }
              })
              .then(response => response.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user)
                  this.onRouteChange('home')
                }
              })
          }
        })
        .catch(console.log)
    }
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  calculateFacePositions = (data) => {
    if (data && data.outputs) {
      const image = document.querySelector('#inputImage')
      const width = Number(image.width)
      const height = Number(image.height)
      return data.outputs[0].data.regions.map(face => {
        const clarifaiFace = face.region_info.bounding_box
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
      })
    }
    return
  }

  setFaceBoxValues = (boxesArray) => {
    if (boxesArray) {
      this.setState({
        boxes: boxesArray
      })
    }
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
    fetch('http://localhost:3001/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('token')
        },
        body: JSON.stringify({
          input: input
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res) {
          fetch('http://localhost:3001/image', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('token')
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
        this.setFaceBoxValues(this.calculateFacePositions(res))
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
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

  toggleModal = () => {
    this.setState(prevState =>({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render() {
      const {
        imageUrl,
        boxes,
        route,
        isProfileOpen,
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
          }
          toggleModal = {
            this.toggleModal
          } />
        { isProfileOpen &&
          <Modal >
            <Profile isProfileOpen = {
              isProfileOpen
            }
            toggleModal = {
              this.toggleModal
            }
            user = {
              this.state.user
            }
            loadUser = {
              this.loadUser
            } />
          </Modal>
        }
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
            boxes = {
              boxes
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
