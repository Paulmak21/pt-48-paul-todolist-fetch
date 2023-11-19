import React, { useState, useEffect } from 'react';
import MatrixRain from './MatrixRain';
import './components/app.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const apiData = 'https://playground.4geeks.com/apis/fake/todos/user/'

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {}, []);

  const updateTodoList= async (theUpdatedList) => {
    await fetch(`${apiData}${username}`, 
      {
      method: 'PUT',
      body: JSON.stringify(theUpdatedList),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((e) => {
      console.log(e);
    })  
      .catch((error) => {console.log(error)});
  };

  const createUser = async () => {
    await fetch(`${apiData}${username}`,
      {
      method: 'POST',
      body: JSON.stringify([]),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((e) => {
      console.log(e);
    });
    await fetch(`${apiData}${username}`,
      {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      })
      .then((res) => res.json())
      .then((e) => {
        setTodos(e);
        console.log(e);
      });
  };
  const deleteCurrentUser = async () => {
  await fetch(`${apiData}${username}`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((res) => res.json())
  .then((e) => {
    console.log(e);
  }
  );
  };

  // const login = () => {
  //   console.log(username);
  //   fetch(`${apiData}${username}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then(async (res) => {
  //     if (res.ok === false) {
  //       console.log(res);
  //       const promise = await createUser(username);
  //       return;
  //     }       
  //     if (res.ok === true)
  //       return res.json();
  //     })
  //     .then((data) => {
  //       if(data !== undefined) {
  //         setTodos(data);
  //       }
  //     });
  //     setIsLoggedIn(!isLoggedIn);
  // };

  const login = async () => {
    const response = await fetch(`${apiData}${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
    if (response.ok === false) {
      await createUser(username);
      return;
    }       
    const data = await response.json();
    if(data !== undefined) {
      setTodos(data);
    }
    setIsLoggedIn(!isLoggedIn);
  }

  const addTodo = () => {
    let pam =
    [...todos, {id: crypto.randomUUID(), label: inputValue, done: false}];
    setTodos(pam);
    setInputValue('');
  };
  const removeTodo = (e) => {
    let pam = todos.filter((element) => element.id !== e.id);
    setTodos(pam);
  };

  useEffect(() => {
    updateTodoList(todos);
  }, [todos]);

  return (
    <>
    <div className='Login__Page'
    style={isLoggedIn ? {backgroundColor:'transaprent'} : {}}>
      <MatrixRain />
      {isLoggedIn && (
        <div className='App__container'>
          <h1 className='todo__title'>
            Welcome to the Matrix {username}!</h1>
          <div className='App__form'>
            <input
              placeholder='Enter a ToDo'
              type='text'
              name='newTodo'
              id='newTodo'
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onClick={() => {
                setInputValue('');
              }}
          ></input>
          <button 
          onClick={() => addTodo()}><FontAwesomeIcon icon={faArrowRight} />
            Add
          </button>
          <div></div>
          <button className='show-hide' onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? 'Hide' : 'Show'}
          </button>
          {isVisible && (
            <ul className="list_items_container">
              {todos.map((e) => {
                  return (
                    <div key={e.id} className="">
                      <li>{e.label}</li>
                      <button
                        className="remove-btn"
                        onClick={() => {
                          removeTodo(e);
                        }}>Eliminar
                      </button>
                    </div>
                  );
                })}
            </ul>
          )}
          <div className="todo-count">
          Total todos: {todos.length}
          </div>
          <button
                onClick={() => {
                  setIsLoggedIn(!isLoggedIn);
                }}
              >
                Back Home
              </button>
        </div>
        <button onClick={() => deleteCurrentUser()}>Delete User</button>
      </div>
      )}
      {!isLoggedIn && (
        <div>
          <div 
            className='login-form'
            >
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              required 
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
               
            />
            <button
              className="login__button"
              onClick={() => {
                login();
              }}
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;