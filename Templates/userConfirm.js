
module.exports = (toEmail, subject, token) => { 

        const message = {};
        message.to = toEmail;
        message.from = "pragadesh72@gmail.com";
        message.subject = subject;
        message.html = `<html>
        <body>
            <div style="text-align: center;">
            <h1>User Confirmation</h1>
            <p>Please click on confirm to accept the invite<p>
            <div>
            <a href="http://localhost:5000/auth/confirmation/${token}">confirm</a>
            </div>  
            </div>
        </body>
</html>
`
        return message;   
}

