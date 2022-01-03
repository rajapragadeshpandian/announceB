
module.exports = (toEmail, subject, token, userId) => { 

    const message = {};
        message.to = toEmail;
        message.from = "pragadesh72@gmail.com";
        message.subject = subject;
        message.html  =  `<html>
            <body>
                <div style="text-align: center;">
                
                <h2>Please click on below links to reset the password</h2>
                            <div>
                            <a href="http://localhost:5000/auth/change/password/${userId}/${token}">Reset password</a>
                            </div>
                

                </div>
            </body>
    </html>
    `;

    return message;
}
