# ug-algo-parrot

项目类型：前端

项目技术选型：

```js
框架：vue3
	文档：https://cn.vuejs.org/
UI库：element-plus
	文档：https://element-plus.gitee.io/zh-CN/component/button.html
打包工具：vite
	文档：https://vitejs.cn/
包管理工具：yarn
	文档：https://yarnpkg.com/
css预编译工具：less
路由：vue router
	文档：https://router.vuejs.org/zh/
状态管理：vuex
	文档：https://vuex.vuejs.org/zh/
```

项目启动流程

```js
1.安装node.js
	- 下载地址：https://nodejs.org/zh-cn/download/
	- 安装完后终端输入下面指令，看能否输出对应版本
		node -v
		npm -v
2.配置npm镜像源（针对国内用户，如果可以流畅访问国外网站省略所有配置镜像源步骤）
    - 查看npm镜像源是否为国内的镜像源
    	npm config list 或者 npm config get registry
    - 如果不是需要配置镜像源(这里用的是淘宝镜像源，可自行选择)
    	npm config set registry https://registry.npm.taobao.org/
3.安装yarn包管理器(如果安装报错需要切换到管理员模式或者sudo npm install yarn -g)
	npm install -g yarn
	- 查看是否安装成功
		yarn -v
	- 配置yarn镜像源
		查看 yarn config get registry
		配置 yarn config set registry https://registry.npm.taobao.org/
4.vscode开发需要安装的插件
	Volar(带海贼王图标的)
	Prettier
5.项目克隆，进入项目目录ug-algo-parrot，切换到自己的分支，执行
	yarn   （等待安装包安装完成）
	yarn dev  （启动项目，访问地址即可）
	
```

项目目录

```js
开发只需要关注src目录
src:
	- api: 接口访问相关的目录，要访问的url放到url.js（注意不一定是真的后台url，因为需要配置代理），index.js是放各种接口的调用的方法
	- assets: 静态资源目录，比如images，less样式
	- components: 公共组件目录，文件夹小写，组件vue文件大写开头
	- pages: 路由相关的组件目录，也就是路由切换的页面组件
	- router：路由目录
	- store: 状态管理目录，用于组件间资源共享
配置文件：
	.env.development  是开发环境会自动读取的配置
	.env.development  是执行build打包会自动读取的配置
	.prettierrc  文件格式化配置
	vite.config.js  vite打包配置文件（可配置文件按需引入，样式变量文件，代理等）
```