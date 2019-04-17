const nodemailer = require('nodemailer')

module.exports =  function sendmail(to, name, body){

   

    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account');
            console.error(err);
            return process.exit(1);
        }
    
        console.log('Credentials obtained, sending message...');
    
        // NB! Store the account object values somewhere if you want
        // to re-use the same account for future mail deliveries
    
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport(
            {
                host: 'mail.24livehost.com',
                port: 587,
                secure: account.smtp.secure,
                auth: {
                    user: 'wwwsmtp@24livehost.com',
                    pass: 'dsmtp909#'
                },
                logger: true,
                debug: false // include SMTP traffic in the logs
            },
            {
                // default message fields
    
                // sender info
                from: 'jayant.bhardwaj@dotsquares.com',
                headers: {
                    'X-Laziness-level': 1000 // just an example header, no need to use this
                }
            }
        );
    
        // Message object
        let message = {
            // Comma separated list of recipients
            to: to,
    
            // Subject of the message
            subject: 'Welcome to Restaurant Management System',
    
            // plaintext body
           // text: 'Hello ' + name,
    
            // HTML body
            html: '<p><b>Hi ' + name +
                 ',</br><p>Welcome to Restaurant Management System<br/> Thank you for joining.'+
                '</br></p><p>' + body +
                '<br/><br/>To login and access, simply click on above url' +
                '<br/><br/>Regards,' +
                 '<br/>Restaurant Management System Team' +
               ' </p>'
        };
    
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                return process.exit(1);
            }
    
            console.log('Message sent successfully!');
            console.log(nodemailer.getTestMessageUrl(info));
    
            // only needed when using pooled connections
            transporter.close();
        });
    });
}



