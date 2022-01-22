export const fetchChanges = (amount) => {
    return (dispatch) => {
        //fetch('https://jsonplaceholder.typicode.com/posts/1')
        //fetch('/changelog')
        fetch('/changelog')
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