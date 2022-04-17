

export const fetchChanges = (url) => {
    return (dispatch) => {
        //fetch('https://jsonplaceholder.typicode.com/posts/1')
        //fetch('/changelog')
        console.log(url)
        fetch(url)
            .then((res) => res.json())
            .then(data => {
                console.log(data);
                dispatch({
                    type: "FETCH_CHANGES",
                    payload: data
                });
            })
            .catch(err => console.log(err))

    }
}


export const fetchUser = () => {
    console.log("user");
    return (dispatch) => {
        fetch('http://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                dispatch({ type: "GET_USERS", data: data })
            })
            .catch((err) => err)
    }
}

export const fetchBlog = () => {
    return (dispatch) => {
        fetch('/changelog/blog/get')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                //history.push('/blog');
                dispatch({ type: "FETCH_BLOG", payload: data })
            })
            .catch((err) => err)
    }
}

export const createBlog = (content) => {
    console.log(content);
    return (dispatch) => {
        fetch('/changelog/blog/create', {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch(err => err)
    }
}

export const fetchCustomer = (values) => {
    console.log(values);
    return (dispatch) => {
        // fetch('/customer/uniqueProps')
        fetch('/customer/uniqueProps', {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify(values),
            //body : token,
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then(data => {
                console.log("customerData", data);
                dispatch({
                    type: "FETCH_CUSTOMER",
                    payload: data
                });
            })
            .catch(err => console.log(err))

    }
}

export const filterCustomer = (values) => {
    console.log(values);
    return (dispatch) => {
        // fetch('/customer/uniqueProps')
        fetch('/customer/filter', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then(data => {
                console.log("customerData", data);
                dispatch({
                    type: "FETCH_CUSTOMER",
                    payload: data
                });
            })
            .catch(err => console.log(err))

    }
}


/*export const registerUser = (values,history) => async (dispatch) => {
    let data;
    console.log("$$$$","fetchuser action called");
    try {
        const res = await fetch('/api/signup', {      
          // Adding method type
          method: "POST",     
          // Adding body or contents to send
          body: JSON.stringify(values),
        //body : token,
          // Adding headers to the request
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
      });
      
       data =  await res.json();
      } catch(err) {
        data = {error : "already existing user"};
      
      }
      if(data && data.email) {
      history.push('/dashboard');
      }
      console.log("$$$$",data);
    
        dispatch({type:FETCH_USER, data : data });
    
    }*/