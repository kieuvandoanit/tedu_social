# Social network for TEDU community


## Technologies stack
- Nodejs
- MongoDB
- Exporess
- TypeScript
## Command remembers
### Lession 9
- Open terminal command windows: Ctrl + `
- npm init or yarn init
- git init
- git commit -m "initial commit"
- git remote add origin https://github.com/kieuvandoanit/tedu_social.git
- git remote show origin
- git push -u origin master
### Lession 10
- tsc --init 
### Lession 15
- role of some middleware
    - hpp: bảo về giúp chống lại các tấn công khi dùng http parameter
    - helmet: add các header bảo mật cho http request
    - morgan: để logging cho dự án. (seri log)
    - cors: Cho phép những domain nào của client được vào
    - winston: làm cho log có màu đẹp hơn
    - esLint: Là 1 thư viện js giúp ta đặt ra các cái rule. Buộc các developer phải tuân theo
    - husky: đưa ra các cái rule để deverloper phải tuân theo trước khi commit code
### Lession 16
- Validate var enviroment

### Lession 17
- import package tsconfig-paths: to nodemon understand đường dẫn  in import file (cu phap: @)
- import package gravatar: để làm ảnh đại diện 
- import package bcryptjs để mã hóa

## ESLINT
yarn add eslint @typescript -eslint/parser @typescript-eslint/eslint-plugin -D

### Cau hinh webpack
- add 5 package:
    - webpack
    - webpack-cli
    - webpack-node-externals
    - webpack-shell-plugin
    - tsconfig-paths-webpack-plugin