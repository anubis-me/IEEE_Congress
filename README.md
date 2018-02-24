# IEEE HUB CONGRESS - BACKEND APPLICATION


API documentation

## Routes Structure

Post request

For SignUp
- POST /api/reguser : Data required (appid,username,email,password,phonenum)
- Response : {success: true, message: 'Account registered!'}

For login
- POST /api/authenticate : Data required (email, password)
- Response : { success: true, message: 'User authenticated!', token: token, user: user }
- token : username, email, phonenum, permission, qrcode, appid, food

For Getting a user's details on the basis of his/her token saved
- POST /api/getUserDetails : Data required (token)
- token:  When the user logs in, save this token and whenever the user opens up the app again, use this saved token to get his/her details using this route
- Response : { success: true, message: "Fetched the user details successfully", user: user}
- user : {username: username, email: email, phonenum: phonenum, qrcode: qrcode, appid: appid, food: food}

For activating wifi coupon
- POST /api/activate : Data required (qrcode,uappid)

For Timeline
- POST /api/timeline : Data required (appid)

For speaker
- POST /api/speaker : Data required (appid)

For Food Coupon
- POST /api/breakfast : Data required (qrcode,uappid)
- POST /api/lunch : Data required (qrcode,uappid)
- POST /api/dinner : Data required (qrcode,uappid)

appid: user app id   ,
uappid: moderator app id
