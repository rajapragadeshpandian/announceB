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