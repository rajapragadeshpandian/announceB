
module.exports = (toEmail, subject, token) => { 

    const message = {};
        message.to = toEmail;
        message.from = "pragadesh72@gmail.com";
        message.subject = subject;
        message.html  =  `<html>
            <body>
                <div style="text-align: center;">
                
                <h2>Please click on below links to accept or decline the invite</h2>
                            <div>
                            <a href="http://localhost:5000/account/invite/accept/${token}">Accept</a>
                            </div>
                            <div>
                            <a href="http://localhost:5000/account/invite/decline/${token}">Decline</a>
                            </div>

                </div>
            </body>
    </html>
    `;

    return message;
}
