# IEEE HUB CONGRESS - BACKEND APPLICATION


API documentation

## Routes Structure

Post request

For SignUp
- /api/reguser : Data required (appid,username,email,password,phonenum)

For login
- /api/authenticate : Data required (email, password)

For activating wifi coupon
- /api/activate : Data required (appid,uappid)

For Timeline
- /api/timeline : Data required (appid)

For speaker 
- /api/speaker : Data required (appid)

For Food Coupon
- /api/foodc : Data required (appid,uappid,fooddetail)


appid: user app id   ,
uappid: moderator app id
