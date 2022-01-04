const auctionsModel = require("./../../db/models/auctions");
const invoicesModel = require("./../../db/models/invoices");
const bidsModel = require("./../../db/models/bids");
const schedule = require("node-schedule");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Config .env file
dotenv.config();

// Email transport
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getAuctions = (req, res) => {
  auctionsModel
    .find({ status: process.env.APPROVED_STATUS })
    .populate("createdBy")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getAuction = (req, res) => {
  const { id } = req.params;

  auctionsModel
    .findOne({ _id: id, status: process.env.APPROVED_STATUS })
    .populate("createdBy buyer")
    .then(async (result) => {
      if (result) {
        const bids = await bidsModel
          .find({ auction: id })
          .populate("createdBy");
        res.status(200).json({ auction: result, bids });
      } else
        res
          .status(404)
          .json({ message: `there is no auction with the ID: ${id}` });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const userAuctions = (req, res) => {
  const { id } = req.params;

  auctionsModel
    .find({ createdBy: id })
    .populate("status")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "this user has no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const createAuction = (req, res) => {
  const {
    title,
    description,
    images,
    initialPrice,
    minIncrement,
    categories,
    endDateTime,
    condition,
  } = req.body;

  const newAuction = new auctionsModel({
    title,
    description,
    images,
    initialPrice,
    currentPrice: initialPrice,
    minIncrement,
    categories,
    endDateTime,
    condition,
    status: process.env.APPROVED_STATUS,
    createdBy: req.token.id,
  });

  newAuction
    .save()
    .then((result) => {
      schedule.scheduleJob(endDateTime, async () => {
        const auction = await auctionsModel
          .findOne({ _id: result._id })
          .populate("createdBy buyer");

        await auctionsModel.findByIdAndUpdate(auction._id, {
          sold: true,
        });

        if (auction.buyer) {
          const newInvoices = new invoicesModel({
            auction: auction._id,
            buyer: auction.buyer,
            status: process.env.PENDING_STATUS,
          });

          newInvoices.save();

          transport.sendMail({
            from: process.env.EMAIL,
            to: auction.createdBy.email,
            subject: "MAZAD - Congrats your auction has been sold",
            html: `<!DOCTYPE html>
            <html>
            
                        <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <style type="text/css">
                                @media screen {
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 400;
                                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 700;
                                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 400;
                                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 700;
                                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                    }
                                }
                        
                                /* CLIENT-SPECIFIC STYLES */
                                body,
                                table,
                                td,
                                a {
                                    -webkit-text-size-adjust: 100%;
                                    -ms-text-size-adjust: 100%;
                                }
                        
                                table,
                                td {
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                }
                        
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
                        
                                /* RESET STYLES */
                                img {
                                    border: 0;
                                    height: auto;
                                    line-height: 100%;
                                    outline: none;
                                    text-decoration: none;
                                }
                        
                                table {
                                    border-collapse: collapse !important;
                                }
                        
                                body {
                                    height: 100% !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 100% !important;
                                }
                        
                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                        
                                /* MOBILE STYLES */
                                @media screen and (max-width:600px) {
                                    h1 {
                                        font-size: 32px !important;
                                        line-height: 32px !important;
                                    }
                                }
                        
                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] {
                                    margin: 0 !important;
                                }
                            </style>
                        </head>
                        
                        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                            <!-- HIDDEN PREHEADER TEXT -->
                            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td bgcolor="#2f2057" align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#2f2057" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                  <img src=" https://firebasestorage.googleapis.com/v0/b/mp-project-bf603.appspot.com/o/logo.png?alt=media&token=3d225bad-973e-4033-a536-d60939d2a2d8" width="125" height="120" style="display: block; border: 0px;" /> <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Congrats ${auction.createdBy.name}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Your auction ${auction.title} has been sold, the user ${auction.buyer.name} has won your auction, get in contact with him/her so you can deliver your item.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Cheers,<br>MAZAD Team</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        
                        </html>`,
          });

          transport.sendMail({
            from: process.env.EMAIL,
            to: auction.buyer.email,
            subject: "MAZAD - Congrats you won an auction",
            html: `<!DOCTYPE html>
            <html>
            
                        <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <style type="text/css">
                                @media screen {
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 400;
                                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 700;
                                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 400;
                                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 700;
                                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                    }
                                }
                        
                                /* CLIENT-SPECIFIC STYLES */
                                body,
                                table,
                                td,
                                a {
                                    -webkit-text-size-adjust: 100%;
                                    -ms-text-size-adjust: 100%;
                                }
                        
                                table,
                                td {
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                }
                        
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
                        
                                /* RESET STYLES */
                                img {
                                    border: 0;
                                    height: auto;
                                    line-height: 100%;
                                    outline: none;
                                    text-decoration: none;
                                }
                        
                                table {
                                    border-collapse: collapse !important;
                                }
                        
                                body {
                                    height: 100% !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 100% !important;
                                }
                        
                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                        
                                /* MOBILE STYLES */
                                @media screen and (max-width:600px) {
                                    h1 {
                                        font-size: 32px !important;
                                        line-height: 32px !important;
                                    }
                                }
                        
                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] {
                                    margin: 0 !important;
                                }
                            </style>
                        </head>
                        
                        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                            <!-- HIDDEN PREHEADER TEXT -->
                            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td bgcolor="#2f2057" align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#2f2057" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                  <img src=" https://firebasestorage.googleapis.com/v0/b/mp-project-bf603.appspot.com/o/logo.png?alt=media&token=3d225bad-973e-4033-a536-d60939d2a2d8" width="125" height="120" style="display: block; border: 0px;" /> <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Congrats ${auction.buyer.name}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">You won the auction ${auction.title}, now you need to go to your dashboard by clicking the button below so you can pay for the item and it will be delivered to you.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="#2f2057"><a href="https://mazadwebsite.herokuapp.com/dashboard/invoices" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #2f2057; display: inline-block;">Dashboard</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #2f2057;">https://mazadwebsite.herokuapp.com/dashboard/invoices</a></p>
                                        </td>
                                    </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Cheers,<br>MAZAD Team</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        
                        </html>`,
          });
        } else {
          transport.sendMail({
            from: process.env.EMAIL,
            to: auction.createdBy.email,
            subject: "MAZAD - Sorry your auction ended without a winner",
            html: `<!DOCTYPE html>
            <html>
            
                        <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <style type="text/css">
                                @media screen {
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 400;
                                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 700;
                                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 400;
                                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                    }
                        
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 700;
                                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                    }
                                }
                        
                                /* CLIENT-SPECIFIC STYLES */
                                body,
                                table,
                                td,
                                a {
                                    -webkit-text-size-adjust: 100%;
                                    -ms-text-size-adjust: 100%;
                                }
                        
                                table,
                                td {
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                }
                        
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
                        
                                /* RESET STYLES */
                                img {
                                    border: 0;
                                    height: auto;
                                    line-height: 100%;
                                    outline: none;
                                    text-decoration: none;
                                }
                        
                                table {
                                    border-collapse: collapse !important;
                                }
                        
                                body {
                                    height: 100% !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 100% !important;
                                }
                        
                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                        
                                /* MOBILE STYLES */
                                @media screen and (max-width:600px) {
                                    h1 {
                                        font-size: 32px !important;
                                        line-height: 32px !important;
                                    }
                                }
                        
                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] {
                                    margin: 0 !important;
                                }
                            </style>
                        </head>
                        
                        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                            <!-- HIDDEN PREHEADER TEXT -->
                            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td bgcolor="#2f2057" align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#2f2057" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                  <img src=" https://firebasestorage.googleapis.com/v0/b/mp-project-bf603.appspot.com/o/logo.png?alt=media&token=3d225bad-973e-4033-a536-d60939d2a2d8" width="125" height="120" style="display: block; border: 0px;" /> <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Sorry ${auction.createdBy.name}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Your auction ${auction.title} ended with no bids, try and add the auction at another time you might get lucky.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Cheers,<br>MAZAD Team</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        
                        </html>`,
          });
        }
      });
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const editAuction = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    images,
    initialPrice,
    minIncrement,
    categories,
    endDateTime,
    condition,
  } = req.body;

  const auction = await auctionsModel.findOne({
    _id: id,
    createdBy: req.token.id,
    status: process.env.APPROVED_STATUS,
    sold: false,
  });

  if (auction) {
    auctionsModel
      .findOneAndUpdate(
        {
          _id: id,
          createdBy: req.token.id,
          status: process.env.APPROVED_STATUS,
          sold: false,
        },
        {
          title: title ? title : auction.title,
          description: description ? description : auction.description,
          images: images ? images : auction.images,
          initialPrice: initialPrice ? initialPrice : auction.initialPrice,
          minIncrement: minIncrement ? minIncrement : auction.minIncrement,
          categories: categories ? categories : auction.categories,
          endDateTime: endDateTime ? endDateTime : auction.endDateTime,
          condition: condition ? condition : auction.condition,
        },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res
            .status(404)
            .json({ message: `There is no auction with this ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res
      .status(404)
      .json({ message: `There is no auction with this ID: ${id}` });
  }
};

const getAllAuctions = (req, res) => {
  auctionsModel
    .find({})
    .populate("createdBy status")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "there is no auctions yet!!" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const changeAuctionStatus = (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  auctionsModel
    .findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: status_id,
      },
      { new: true }
    )
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: `There is no auction with this ID: ${id}` });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getAuctions,
  getAuction,
  userAuctions,
  createAuction,
  editAuction,
  getAllAuctions,
  changeAuctionStatus,
};
