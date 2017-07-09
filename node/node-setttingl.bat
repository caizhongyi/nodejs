:: set "NODE_PATH=%~dp0\node_modules"  
  
::npm config set proxy null
::echo "set proxy null"
npm config set prefix "%~dp0\node_global"
echo "set prefix %~dp0\node_global"
npm config set cache "%~dp0\node_cache"
echo "set cache %~dp0\node_cache"

:: npm install spm-init   # 一定要装
:: npm install spm-build # 一定要装
:: npm install spm-doc   # 一定要装, 这个很好
:: npm install spm-publish  # 这个命令发布你的模块到seajs.org, 必须注册seajs.org网站用户
:: npm install spm-deploy  # 这个命令应该是ssh发布到服务器


:: echo "%PATH%"
