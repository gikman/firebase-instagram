import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';
import TweetEmbed from 'react-tweet-embed';
import axios from './axios';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {

        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

  }, [user, username]);


  // useEffect(() => {
  //   const pusher = new Pusher('b9db0660bd4bf2129b63', {
  //     cluster: 'mt1'
  //   });

  //   const channel = pusher.subscribe('');
  //   channel.bind('my-event', function(data) {
  //     alert(JSON.stringify(data));
  //   });
  // }, [])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })

    // const fetchPosts = async () =>

    // await axios.get('/sync').then(response => {
    //   console.log(response);
    //   setPosts(response.data)
    // });

    // fetchPosts();
  }, []);

  console.log('posts are >>>', posts)

  
  const handleLogin = (e) => {
    e.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    // .then((authUser) => {
    //   return authUser.user.updateProfile({
    //     displayName: username
    //   })
    // })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const handleRegister = (e) => {
      e.preventDefault();

      auth
      .createUserWithEmailAndPassword(email, password)
      // .then((authUser) => {
      //   return authUser.user.updateProfile({
      //     displayName: username
      //   })
      // })
      .catch((error) => alert(error.message));

      setRegisterOpen(false);
    }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
             />
          </center>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type ="submit" onClick={handleLogin}>Login</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
            <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
             />
          </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type ="submit" onClick={handleRegister}>Register</Button>
          </form>
        </div>
      </Modal>



      <div className="app__header">
          <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>

          {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Login</Button>
              <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post 
                key={id} 
                postId={id} 
                // username={post.username}
                username={post.user}
                user={user} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
              />
            ))
          }
        </div>
        
        <div className="app__postsRight">
          {/* <InstagramEmbed
            url='https://instagram/p/CEcB__WgRn8/'
            maxWidth={500}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
          <TweetEmbed id="1319700311368372224" className="tweetembed"/>
        </div>
      </div>
      
      <div className="app__bottom"> 
        {user?.displayName ? (
        <ImageUpload username={user.displayName} />
         ) : (
            <h3 className="app__sorry">Login to upload</h3>
         )}
      </div>
      
    </div>
  );
}

export default App;
