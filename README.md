# IEEE HUB CONGRESS - BACKEND APPLICATION

API documentation

## Routes Structure

=> Base URL
   https://congress-backend.herokuapp.com

=> Routes

For SignUp
- POST /authenticate/reguser : Data required (appid,username,email,password,phonenum)
- Response : {success: true, message: 'Account registered!'}

For login
- POST /authenticate/authenticate : Data required (email, password)
- Response : { success: true, message: 'User authenticated!', token: token, user: user }
- token : username, email, phonenum, permission, qrcode, appid, food

For Getting a user's details on the basis of his/her token saved
- GET /participant/getUserDetails : Headers required (x-access-token: token)
- token:  When the user logs in, save this token and whenever the user opens up the app again, use this saved token to get his/her details using this route
- Response : { success: true, message: "Fetched the user details successfully", user: user}
- user : {username: username, email: email, phonenum: phonenum, qrcode: qrcode, appid: appid, food: food}

For activating wifi coupon
- POST /admin/activate : Data required (qrcode,uappid) and Headers required (x-access-token: token)
- Response : { success: true, message: "Wifi coupon activated", coupon: coupon }

For Timeline
- POST /participant/timeline : Data required (appid) and Headers required (x-access-token: token)

For speaker
- POST /participant/speaker : Data required (appid) and Headers required (x-access-token: token)

For Food Coupon
- POST /admin/food/breakfast : Data required (qrcode,uappid) and Headers required (x-access-token: token)
- POST /admin/food/lunch : Data required (qrcode,uappid) and Headers required (x-access-token: token)
- POST /admin/food/dinner : Data required (qrcode,uappid) and Headers required (x-access-token: token)
- Response : { success: true, message: "User has now eaten <mealName>" }

For validating if the user has paid or not and if he/she has paid then, modify their personal according to the event
- POST /admin/validatePayment/ai : Data required (qrcode) and Headers required (x-access-token: token)
- POST /admin/validatePayment/android : Data required (qrcode) and Headers required (x-access-token: token)
- POST /admin/validatePayment/iot : Data required (qrcode) and Headers required (x-access-token: token)
- POST /admin/validatePayment/congress : Data required (qrcode) and Headers required (x-access-token: token)
- Response : { success: true, message: "User's payment validated for the <eventName> event successfully" }

=> Variables

qrcode: participant's qrcode,
appid: participant app id,
uappid: moderator app id
