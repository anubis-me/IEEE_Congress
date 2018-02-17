# IEEE HUB CONGRESS - BACKEND APPLICATION


API documentation

## Routes Structure

Post request

For SignUp
- /api/reguser : Data required (appid,username,email,password,phonenum)
- Response : {success: true, message: 'Account registered!'}

For login
- /api/authenticate : Data required (email, password)
- Response : { success: true, message: 'User authenticated!', token: token }
token : username, email, phonenum, permission, qrcode, appid

For activating wifi coupon
- /api/activate : Data required (qrcode,uappid)

For Timeline
- /api/timeline : Data required (appid)

For speaker
- /api/speaker : Data required (appid)

For Food Coupon
- /api/foodc : Data required (qrcode,uappid,fooddetail)


appid: user app id   ,
uappid: moderator app id
